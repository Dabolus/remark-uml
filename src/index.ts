import { PlantUmlPipe } from 'plantuml-pipe';
import { optimize as svgo, OptimizeOptions } from 'svgo';
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import replaceAsync from 'string-replace-async';
import type { Plugin } from 'unified';

export interface RemarkUmlConfig {
  readonly format?: 'png' | 'svg' | 'txt' | 'utxt';
  readonly optimize?: boolean | null | OptimizeOptions;
  readonly languageName?: string | null;
}

const compileUml = (
  input: string,
  {
    format = 'svg',
    optimize = true,
    languageName = 'uml',
  }: RemarkUmlConfig = {},
): Promise<string> =>
  new Promise((resolve, reject) => {
    const puml = new PlantUmlPipe({ outputFormat: format });

    puml.out.once('data', (outputBuffer: Buffer) => {
      const output = outputBuffer.toString(
        format === 'png' ? 'base64' : 'utf8',
      );

      switch (format) {
        case 'svg':
          if (!optimize) {
            return resolve(output.slice(output.indexOf('?>') + 2));
          }

          const { data } = svgo(
            output,
            typeof optimize === 'boolean' ? { multipass: true } : optimize,
          );

          return resolve(data);
        case 'png':
          // NOTE: it might be a great idea to allow to specify an alt text somehow
          return resolve(`![](data:image/png;base64,${output})`);
        case 'txt':
        case 'utxt':
          return resolve(
            `\`\`\`${languageName ? languageName : ''}\n${output}\`\`\``,
          );
      }
    });
    puml.out.once('error', reject);

    puml.in.write(input);
    puml.in.end();
  });

const uml: Plugin<[RemarkUmlConfig?]> = (config = {}) => async (ast) => {
  const compiled = await replaceAsync(
    toMarkdown(ast),
    /@startuml({.+?})?.+?@enduml/gs,
    (match, inlineConfig) => {
      let parsedInlineConfig;
      try {
        parsedInlineConfig = JSON.parse(inlineConfig);
      } catch {}

      return compileUml(match, {
        ...config,
        ...parsedInlineConfig,
      });
    },
  );

  return fromMarkdown(compiled);
};

export default uml;
