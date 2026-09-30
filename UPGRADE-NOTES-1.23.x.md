# SPFx 1.23.x tooling upgrade

## Changes made

- Bumped the npm package version from `0.0.19` to `0.0.20` and synchronized the
  SharePoint package and feature versions to `0.0.20.0`.
- Updated the SPFx runtime packages, module interfaces, ESLint config/plugin,
  generator metadata, and solution MPN marker to SPFx `1.23.2`.
- Moved from Gulp to the SPFx 1.23.2 Heft/Rig setup:
  - Replaced Gulp scripts and `gulpfile.js` with the generated Heft build,
    clean, start, test, and webpack-eject scripts.
  - Added the SPFx web build Rig (`config/rig.json`) and Heft TypeScript/Sass
    configuration (`config/typescript.json`, `config/sass.json`).
  - Changed `tsconfig.json` to extend the SPFx Rig base while retaining the
    project's existing compiler options and source includes.
  - Replaced legacy `.eslintrc.js` with the SPFx React flat config
    (`eslint.config.js`) required by the SPFx 1.23 ESLint 9 toolchain.
- Updated the Node engine requirement to `>=22.14.0 <23.0.0`, matching the
  SPFx 1.23.2 generator defaults.
- Updated `package-lock.json` to match `package.json`.
- Left `config/config.json`, `serve.json`, `deploy-azure-storage.json`, and
  `write-manifests.json` unchanged because they already use the current SPFx
  config schemas and match the generator's defaults. Heft uses
  `staticAssetsToCopy` in `config/typescript.json`; no Gulp `copy-assets.json`
  is needed.

The reference repository `fps-solutions/Core-FPT-1.22.X` was not accessible
from this session. Configuration choices were checked against the published
SPFx 1.23.2 generator templates instead.

## Manual verification still required

- `npm ci` currently fails because `@mikezimm/fps-library-v2@2.1.170` does
  not declare SPFx 1.23.2 in its peer range. `npm ci --legacy-peer-deps`
  installs the lockfile, but the peer mismatch must be resolved or confirmed
  by the library maintainer before adopting the upgrade.
- `npm test` starts the Heft pipeline but reports 13 TypeScript errors in
  existing webpart code and the FPS library's style types. Source compatibility
  fixes are intentionally out of scope; `npm run build` is blocked by the same
  errors.
- Check webpart and dependency compatibility with SPFx 1.23.2, especially
  `@mikezimm/fps-library-v2@2.1.170`, whose published peer range currently
  stops at SPFx 1.22.1.
- Review lint output and restore any project-specific ESLint rules needed;
  lint errors and source fixes are intentionally out of scope here.
- Validate the existing webpack bundle analyzer workflow: its custom Gulp
  integration was removed with `gulpfile.js`.
- Test the produced `.sppkg` in a SharePoint tenant before deployment.
- The updated lockfile reports 29 npm audit findings (18 moderate, 8 high,
  and 3 critical), mostly in transitive tool dependencies; the original lockfile
  reported 167. Review the findings and available upstream fixes before release.
