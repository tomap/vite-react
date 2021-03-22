import { ConfigEnv } from 'vite';
import styleImport from 'vite-plugin-style-import';
import { hasInstallPackage } from '../util/pkgInfo';
import { Config } from '../vite';

export interface OverrideAntd {
  /**
   * @see node_modules/antd/es/style/themes/default.less
   */
  antdTheme?: object;
  /**
   * @see node_modules/antd-mobile/es/style/themes/default.less
   */
  antdMobileTheme?: object;
}

export const handleAntd = (config: Config, _env: ConfigEnv) => {
  config.plugins ||= [];
  config.css ||= {};
  const libs: Parameters<typeof styleImport>[0]['libs'] = [];

  if (hasInstallPackage('antd')) {
    config.css.preprocessorOptions ??= {};
    config.css.preprocessorOptions.less = {
      javascriptEnabled: true,
      modifyVars: config.antdTheme,
    };

    libs.push({
      libraryName: 'antd',
      esModule: true,
      resolveStyle: (name) => `antd/es/${name}/style/index`,
    });
  }

  if (hasInstallPackage('antd-mobile')) {
    config.css.preprocessorOptions ??= {};
    config.css.preprocessorOptions.less = {
      javascriptEnabled: true,
      modifyVars: config.antdMobileTheme,
    };

    libs.push({
      libraryName: 'antd-mobile',
      esModule: true,
      resolveStyle: (name) => `antd-mobile/es/${name}/style/index`,
    });
  }

  if (libs.length) {
    config.plugins.push(styleImport({ libs }));
  }
}
