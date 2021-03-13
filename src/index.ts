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

const compileUml = ({
  format = 'svg',
  optimize = true,
  languageName = 'uml',
}: RemarkUmlConfig = {}) => (input: string): Promise<string> =>
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
          return resolve(`<img src="data:image/png;base64,${output}" alt="">`);
        case 'txt':
        case 'utxt':
          return resolve(
            `\`\`\`${languageName ? languageName : ''}\n${output}\n\`\`\``,
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
    /@startuml.+?@enduml/gs,
    compileUml(config),
  );

  return fromMarkdown(compiled);
};

export default uml;
