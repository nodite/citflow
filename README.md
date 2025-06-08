citflow
=================

A amazing command line interface to operate citflow.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/citflow.svg)](https://npmjs.org/package/citflow)
[![Downloads/week](https://img.shields.io/npm/dw/citflow.svg)](https://npmjs.org/package/citflow)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g citflow
$ citflow COMMAND
running command...
$ citflow (--version)
citflow/0.0.0 darwin-arm64 node-v22.12.0
$ citflow --help [COMMAND]
USAGE
  $ citflow COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`citflow hello PERSON`](#citflow-hello-person)
* [`citflow hello world`](#citflow-hello-world)
* [`citflow help [COMMAND]`](#citflow-help-command)
* [`citflow plugins`](#citflow-plugins)
* [`citflow plugins add PLUGIN`](#citflow-plugins-add-plugin)
* [`citflow plugins:inspect PLUGIN...`](#citflow-pluginsinspect-plugin)
* [`citflow plugins install PLUGIN`](#citflow-plugins-install-plugin)
* [`citflow plugins link PATH`](#citflow-plugins-link-path)
* [`citflow plugins remove [PLUGIN]`](#citflow-plugins-remove-plugin)
* [`citflow plugins reset`](#citflow-plugins-reset)
* [`citflow plugins uninstall [PLUGIN]`](#citflow-plugins-uninstall-plugin)
* [`citflow plugins unlink [PLUGIN]`](#citflow-plugins-unlink-plugin)
* [`citflow plugins update`](#citflow-plugins-update)

## `citflow hello PERSON`

Say hello

```
USAGE
  $ citflow hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ citflow hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/nodite/citflow/citflow/blob/v0.0.0/src/commands/hello/index.ts)_

## `citflow hello world`

Say hello world

```
USAGE
  $ citflow hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ citflow hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/nodite/citflow/citflow/blob/v0.0.0/src/commands/hello/world.ts)_

## `citflow help [COMMAND]`

Display help for citflow.

```
USAGE
  $ citflow help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for citflow.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.28/src/commands/help.ts)_

## `citflow plugins`

List installed plugins.

```
USAGE
  $ citflow plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ citflow plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/index.ts)_

## `citflow plugins add PLUGIN`

Installs a plugin into citflow.

```
USAGE
  $ citflow plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into citflow.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the CITFLOW_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the CITFLOW_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ citflow plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ citflow plugins add myplugin

  Install a plugin from a github url.

    $ citflow plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ citflow plugins add someuser/someplugin
```

## `citflow plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ citflow plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ citflow plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/inspect.ts)_

## `citflow plugins install PLUGIN`

Installs a plugin into citflow.

```
USAGE
  $ citflow plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into citflow.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the CITFLOW_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the CITFLOW_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ citflow plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ citflow plugins install myplugin

  Install a plugin from a github url.

    $ citflow plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ citflow plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/install.ts)_

## `citflow plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ citflow plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ citflow plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/link.ts)_

## `citflow plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ citflow plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ citflow plugins unlink
  $ citflow plugins remove

EXAMPLES
  $ citflow plugins remove myplugin
```

## `citflow plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ citflow plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/reset.ts)_

## `citflow plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ citflow plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ citflow plugins unlink
  $ citflow plugins remove

EXAMPLES
  $ citflow plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/uninstall.ts)_

## `citflow plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ citflow plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ citflow plugins unlink
  $ citflow plugins remove

EXAMPLES
  $ citflow plugins unlink myplugin
```

## `citflow plugins update`

Update installed plugins.

```
USAGE
  $ citflow plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/update.ts)_
<!-- commandsstop -->
