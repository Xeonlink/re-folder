/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as WatchersImport } from "./routes/watchers"
import { Route as SettingsImport } from "./routes/settings"
import { Route as RulesImport } from "./routes/rules"
import { Route as FolderPresetImport } from "./routes/folder-preset"
import { Route as IndexImport } from "./routes/index"
import { Route as WatchersIndexImport } from "./routes/watchers/index"
import { Route as SettingsIndexImport } from "./routes/settings/index"
import { Route as FolderPresetsIndexImport } from "./routes/folder-presets/index"
import { Route as WatchersWatcherIdIndexImport } from "./routes/watchers/$watcherId/index"
import { Route as SettingsUpdateIndexImport } from "./routes/settings/update/index"
import { Route as SettingsOpenaiIndexImport } from "./routes/settings/openai/index"
import { Route as RulesRuleIdIndexImport } from "./routes/rules/$ruleId/index"
import { Route as FolderPresetsFolderPresetIdIndexImport } from "./routes/folder-presets/$folderPresetId/index"

// Create/Update Routes

const WatchersRoute = WatchersImport.update({
  id: "/watchers",
  path: "/watchers",
  getParentRoute: () => rootRoute,
} as any)

const SettingsRoute = SettingsImport.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => rootRoute,
} as any)

const RulesRoute = RulesImport.update({
  id: "/rules",
  path: "/rules",
  getParentRoute: () => rootRoute,
} as any)

const FolderPresetRoute = FolderPresetImport.update({
  id: "/folder-preset",
  path: "/folder-preset",
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

const WatchersIndexRoute = WatchersIndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => WatchersRoute,
} as any)

const SettingsIndexRoute = SettingsIndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => SettingsRoute,
} as any)

const FolderPresetsIndexRoute = FolderPresetsIndexImport.update({
  id: "/folder-presets/",
  path: "/folder-presets/",
  getParentRoute: () => rootRoute,
} as any)

const WatchersWatcherIdIndexRoute = WatchersWatcherIdIndexImport.update({
  id: "/$watcherId/",
  path: "/$watcherId/",
  getParentRoute: () => WatchersRoute,
} as any)

const SettingsUpdateIndexRoute = SettingsUpdateIndexImport.update({
  id: "/update/",
  path: "/update/",
  getParentRoute: () => SettingsRoute,
} as any)

const SettingsOpenaiIndexRoute = SettingsOpenaiIndexImport.update({
  id: "/openai/",
  path: "/openai/",
  getParentRoute: () => SettingsRoute,
} as any)

const RulesRuleIdIndexRoute = RulesRuleIdIndexImport.update({
  id: "/$ruleId/",
  path: "/$ruleId/",
  getParentRoute: () => RulesRoute,
} as any)

const FolderPresetsFolderPresetIdIndexRoute =
  FolderPresetsFolderPresetIdIndexImport.update({
    id: "/folder-presets/$folderPresetId/",
    path: "/folder-presets/$folderPresetId/",
    getParentRoute: () => rootRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/"
      path: "/"
      fullPath: "/"
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/folder-preset": {
      id: "/folder-preset"
      path: "/folder-preset"
      fullPath: "/folder-preset"
      preLoaderRoute: typeof FolderPresetImport
      parentRoute: typeof rootRoute
    }
    "/rules": {
      id: "/rules"
      path: "/rules"
      fullPath: "/rules"
      preLoaderRoute: typeof RulesImport
      parentRoute: typeof rootRoute
    }
    "/settings": {
      id: "/settings"
      path: "/settings"
      fullPath: "/settings"
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    "/watchers": {
      id: "/watchers"
      path: "/watchers"
      fullPath: "/watchers"
      preLoaderRoute: typeof WatchersImport
      parentRoute: typeof rootRoute
    }
    "/folder-presets/": {
      id: "/folder-presets/"
      path: "/folder-presets"
      fullPath: "/folder-presets"
      preLoaderRoute: typeof FolderPresetsIndexImport
      parentRoute: typeof rootRoute
    }
    "/settings/": {
      id: "/settings/"
      path: "/"
      fullPath: "/settings/"
      preLoaderRoute: typeof SettingsIndexImport
      parentRoute: typeof SettingsImport
    }
    "/watchers/": {
      id: "/watchers/"
      path: "/"
      fullPath: "/watchers/"
      preLoaderRoute: typeof WatchersIndexImport
      parentRoute: typeof WatchersImport
    }
    "/folder-presets/$folderPresetId/": {
      id: "/folder-presets/$folderPresetId/"
      path: "/folder-presets/$folderPresetId"
      fullPath: "/folder-presets/$folderPresetId"
      preLoaderRoute: typeof FolderPresetsFolderPresetIdIndexImport
      parentRoute: typeof rootRoute
    }
    "/rules/$ruleId/": {
      id: "/rules/$ruleId/"
      path: "/$ruleId"
      fullPath: "/rules/$ruleId"
      preLoaderRoute: typeof RulesRuleIdIndexImport
      parentRoute: typeof RulesImport
    }
    "/settings/openai/": {
      id: "/settings/openai/"
      path: "/openai"
      fullPath: "/settings/openai"
      preLoaderRoute: typeof SettingsOpenaiIndexImport
      parentRoute: typeof SettingsImport
    }
    "/settings/update/": {
      id: "/settings/update/"
      path: "/update"
      fullPath: "/settings/update"
      preLoaderRoute: typeof SettingsUpdateIndexImport
      parentRoute: typeof SettingsImport
    }
    "/watchers/$watcherId/": {
      id: "/watchers/$watcherId/"
      path: "/$watcherId"
      fullPath: "/watchers/$watcherId"
      preLoaderRoute: typeof WatchersWatcherIdIndexImport
      parentRoute: typeof WatchersImport
    }
  }
}

// Create and export the route tree

interface RulesRouteChildren {
  RulesRuleIdIndexRoute: typeof RulesRuleIdIndexRoute
}

const RulesRouteChildren: RulesRouteChildren = {
  RulesRuleIdIndexRoute: RulesRuleIdIndexRoute,
}

const RulesRouteWithChildren = RulesRoute._addFileChildren(RulesRouteChildren)

interface SettingsRouteChildren {
  SettingsIndexRoute: typeof SettingsIndexRoute
  SettingsOpenaiIndexRoute: typeof SettingsOpenaiIndexRoute
  SettingsUpdateIndexRoute: typeof SettingsUpdateIndexRoute
}

const SettingsRouteChildren: SettingsRouteChildren = {
  SettingsIndexRoute: SettingsIndexRoute,
  SettingsOpenaiIndexRoute: SettingsOpenaiIndexRoute,
  SettingsUpdateIndexRoute: SettingsUpdateIndexRoute,
}

const SettingsRouteWithChildren = SettingsRoute._addFileChildren(
  SettingsRouteChildren,
)

interface WatchersRouteChildren {
  WatchersIndexRoute: typeof WatchersIndexRoute
  WatchersWatcherIdIndexRoute: typeof WatchersWatcherIdIndexRoute
}

const WatchersRouteChildren: WatchersRouteChildren = {
  WatchersIndexRoute: WatchersIndexRoute,
  WatchersWatcherIdIndexRoute: WatchersWatcherIdIndexRoute,
}

const WatchersRouteWithChildren = WatchersRoute._addFileChildren(
  WatchersRouteChildren,
)

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute
  "/folder-preset": typeof FolderPresetRoute
  "/rules": typeof RulesRouteWithChildren
  "/settings": typeof SettingsRouteWithChildren
  "/watchers": typeof WatchersRouteWithChildren
  "/folder-presets": typeof FolderPresetsIndexRoute
  "/settings/": typeof SettingsIndexRoute
  "/watchers/": typeof WatchersIndexRoute
  "/folder-presets/$folderPresetId": typeof FolderPresetsFolderPresetIdIndexRoute
  "/rules/$ruleId": typeof RulesRuleIdIndexRoute
  "/settings/openai": typeof SettingsOpenaiIndexRoute
  "/settings/update": typeof SettingsUpdateIndexRoute
  "/watchers/$watcherId": typeof WatchersWatcherIdIndexRoute
}

export interface FileRoutesByTo {
  "/": typeof IndexRoute
  "/folder-preset": typeof FolderPresetRoute
  "/rules": typeof RulesRouteWithChildren
  "/folder-presets": typeof FolderPresetsIndexRoute
  "/settings": typeof SettingsIndexRoute
  "/watchers": typeof WatchersIndexRoute
  "/folder-presets/$folderPresetId": typeof FolderPresetsFolderPresetIdIndexRoute
  "/rules/$ruleId": typeof RulesRuleIdIndexRoute
  "/settings/openai": typeof SettingsOpenaiIndexRoute
  "/settings/update": typeof SettingsUpdateIndexRoute
  "/watchers/$watcherId": typeof WatchersWatcherIdIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  "/": typeof IndexRoute
  "/folder-preset": typeof FolderPresetRoute
  "/rules": typeof RulesRouteWithChildren
  "/settings": typeof SettingsRouteWithChildren
  "/watchers": typeof WatchersRouteWithChildren
  "/folder-presets/": typeof FolderPresetsIndexRoute
  "/settings/": typeof SettingsIndexRoute
  "/watchers/": typeof WatchersIndexRoute
  "/folder-presets/$folderPresetId/": typeof FolderPresetsFolderPresetIdIndexRoute
  "/rules/$ruleId/": typeof RulesRuleIdIndexRoute
  "/settings/openai/": typeof SettingsOpenaiIndexRoute
  "/settings/update/": typeof SettingsUpdateIndexRoute
  "/watchers/$watcherId/": typeof WatchersWatcherIdIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | "/"
    | "/folder-preset"
    | "/rules"
    | "/settings"
    | "/watchers"
    | "/folder-presets"
    | "/settings/"
    | "/watchers/"
    | "/folder-presets/$folderPresetId"
    | "/rules/$ruleId"
    | "/settings/openai"
    | "/settings/update"
    | "/watchers/$watcherId"
  fileRoutesByTo: FileRoutesByTo
  to:
    | "/"
    | "/folder-preset"
    | "/rules"
    | "/folder-presets"
    | "/settings"
    | "/watchers"
    | "/folder-presets/$folderPresetId"
    | "/rules/$ruleId"
    | "/settings/openai"
    | "/settings/update"
    | "/watchers/$watcherId"
  id:
    | "__root__"
    | "/"
    | "/folder-preset"
    | "/rules"
    | "/settings"
    | "/watchers"
    | "/folder-presets/"
    | "/settings/"
    | "/watchers/"
    | "/folder-presets/$folderPresetId/"
    | "/rules/$ruleId/"
    | "/settings/openai/"
    | "/settings/update/"
    | "/watchers/$watcherId/"
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  FolderPresetRoute: typeof FolderPresetRoute
  RulesRoute: typeof RulesRouteWithChildren
  SettingsRoute: typeof SettingsRouteWithChildren
  WatchersRoute: typeof WatchersRouteWithChildren
  FolderPresetsIndexRoute: typeof FolderPresetsIndexRoute
  FolderPresetsFolderPresetIdIndexRoute: typeof FolderPresetsFolderPresetIdIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  FolderPresetRoute: FolderPresetRoute,
  RulesRoute: RulesRouteWithChildren,
  SettingsRoute: SettingsRouteWithChildren,
  WatchersRoute: WatchersRouteWithChildren,
  FolderPresetsIndexRoute: FolderPresetsIndexRoute,
  FolderPresetsFolderPresetIdIndexRoute: FolderPresetsFolderPresetIdIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/folder-preset",
        "/rules",
        "/settings",
        "/watchers",
        "/folder-presets/",
        "/folder-presets/$folderPresetId/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/folder-preset": {
      "filePath": "folder-preset.tsx"
    },
    "/rules": {
      "filePath": "rules.tsx",
      "children": [
        "/rules/$ruleId/"
      ]
    },
    "/settings": {
      "filePath": "settings.tsx",
      "children": [
        "/settings/",
        "/settings/openai/",
        "/settings/update/"
      ]
    },
    "/watchers": {
      "filePath": "watchers.tsx",
      "children": [
        "/watchers/",
        "/watchers/$watcherId/"
      ]
    },
    "/folder-presets/": {
      "filePath": "folder-presets/index.tsx"
    },
    "/settings/": {
      "filePath": "settings/index.tsx",
      "parent": "/settings"
    },
    "/watchers/": {
      "filePath": "watchers/index.tsx",
      "parent": "/watchers"
    },
    "/folder-presets/$folderPresetId/": {
      "filePath": "folder-presets/$folderPresetId/index.tsx"
    },
    "/rules/$ruleId/": {
      "filePath": "rules/$ruleId/index.tsx",
      "parent": "/rules"
    },
    "/settings/openai/": {
      "filePath": "settings/openai/index.tsx",
      "parent": "/settings"
    },
    "/settings/update/": {
      "filePath": "settings/update/index.tsx",
      "parent": "/settings"
    },
    "/watchers/$watcherId/": {
      "filePath": "watchers/$watcherId/index.tsx",
      "parent": "/watchers"
    }
  }
}
ROUTE_MANIFEST_END */
