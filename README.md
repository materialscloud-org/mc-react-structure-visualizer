# Materials Cloud React Structure Visualizer

A React component to visualize structures on the Materials Cloud platform.

Install via

```
npm install mc-react-structure-visualizer
```

Note: make sure all `peerDependencies` (defined in `package.json`) are installed in the host application!

Note: the library (i.e. npm package) only contains the code in `src/StructureVisualizer` folder. The rest of the code in `src/` is for development/demo purposes.

## Development

### Using the demo page

For developing the library of components, start the demo page (in `src\`) by

```
npm install
npm run dev
```

### Building and testing locally

To build the library and test it locally in an external application (before publishing to npm), use

```
npm run build
npm pack
```

which will create a `.tgz` file that can then be installed by the external application via

```
npm install /path/to/package-x.y.z.tgz
```

### Publishing a new version

To make a new version and publish to npm via GitHub Actions:

```bash
npm version <major/minor/patch>
git push --follow-tags
```
