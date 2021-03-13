import { PlantUmlPipe } from 'plantuml-pipe';
import { optimize as svgo, OptimizeOptions } from 'svgo';
import fromMarkdown from 'mdast-util-from-markdown';
import toMarkdown from 'mdast-util-to-markdown';
import replaceAsync from 'string-replace-async';
import type { Plugin } from 'unified';

export interface RemarkUmlConfig {
  readonly optimize?: boolean | null | OptimizeOptions;
}

const compileUml = ({ optimize = true }: RemarkUmlConfig = {}) => (
  input: string,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const puml = new PlantUmlPipe({ outputFormat: 'svg' });

    puml.out.once('data', (outputBuffer: Buffer) => {
      const output = outputBuffer.toString();

      if (!optimize) {
        return resolve(output.slice(output.indexOf('?>') + 2));
      }

      const { data } = svgo(
        output,
        typeof optimize === 'boolean' ? { multipass: true } : optimize,
      );

      return resolve(data);
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
