import { join } from 'path';
import { IConfig } from 'umi-types';
import slash from 'slash2';

const cssLoaderOptions = {
  modules: true,
  getLocalIdent: (
    context: {
      resourcePath: string;
    },
    localIdentName: string,
    localName: string,
  ) => {
    if (
      context.resourcePath.includes('node_modules') ||
      context.resourcePath.includes('ant.design.pro.less') ||
      context.resourcePath.includes('global.less')
    ) {
      return localName;
    }

    // console.log(">>>>>>", context.resourcePath, localName)

    const match = context.resourcePath.match(/umi-example-ssr-with-egg(.*)/);

    if (match && match[1]) {
      const antdProPath = match[1].replace('.less', '');
      const arr = slash(antdProPath)
        .split('/')
        .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
        .map((a: string) => a.toLowerCase());
      return `am${arr.join('-')}-${localName}`.replace(/--/g, '-');
    }

    return localName;
  },
};

const config: IConfig = {
  ssr: true,
  outputPath: '../public',
  // publicPath: '/public/',
  plugins: [
    [
      'umi-plugin-react',
      {
        locale: {
          baseNavigator: false,
        },
        hd: false,
        antd: true,
        dva: {
          immer: true,
        },
        // TODO, page router css leak
        // dynamicImport: {
        //   webpackChunkName: true,
        // },
      },
    ],
  ],
  runtimePublicPath: true,
  disableCSSModules: true,
  cssModulesWithAffix: true,

  cssLoaderOptions,

  lessLoaderOptions: {
    javascriptEnabled: true,
  },
};

export default config;
