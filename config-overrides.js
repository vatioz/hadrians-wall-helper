/* config-overrides.js */
module.exports = function override(config, env) {
  // Remove ModuleScopePlugin which restricts imports to src folder
  config.resolve.plugins = config.resolve.plugins.filter(
    plugin => plugin.constructor.name !== 'ModuleScopePlugin'
  );
  
  return config;
};

module.exports.jest = function overrideJest(config) {
  config.transformIgnorePatterns = [
    '[/\\\\]node_modules[/\\\\](?!(@mui[/\\\\]|@babel[/\\\\]runtime[/\\\\]|nanoid[/\\\\]))',
    '^.+\\.module\\.(css|sass|scss)$',
  ];

  return config;
};
