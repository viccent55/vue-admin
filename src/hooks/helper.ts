// Define the structure of a menu item for type safety
interface MenuItem {
  ID: number;
  parentId: number;
  children: MenuItem[] | null;
  [key: string]: any; // Allows for all the other properties
}

const buildMenuTree = (
  data: MenuItem[],
  idKey: keyof MenuItem = "ID",
  parentIdKey: keyof MenuItem = "parentId",
  childrenKey: keyof MenuItem = "children"
): MenuItem[] => {
  const tree: MenuItem[] = [];
  const map: { [key: number]: MenuItem } = {};
  // 1. Map all items by their ID for quick lookup
  data.forEach((item) => {
    // Initialize children as an empty array to ensure it exists for nesting
    item[childrenKey] = [];
    map[item[idKey] as number] = item;
  });

  // 2. Iterate through all items and place them under their parent
  data.forEach((item) => {
    const parentId = item[parentIdKey] as number;

    // If a parent exists in the map (it's not a root node)
    if (parentId !== 0 && map[parentId]) {
      // Push the current item to the parent's children array
      // We use item[childrenKey] which is guaranteed to be an array from step 1
      (map[parentId][childrenKey] as MenuItem[]).push(item);
    } else {
      // Otherwise, it's a root node, add it to the final tree array
      tree.push(item);
    }
  });

  return tree;
};

interface Api {
  ID: number;
  path: string;
  apiGroup: string;
  description: string;
  [key: string]: any;
}

interface ApiGroup {
  ID: number;
  path: string;
  description: string;
  children: Api[];
}

const apisToTree = (apis: Api[]): ApiGroup[] => {
  const apiMap = new Map<string, ApiGroup>();
  apis.forEach((api) => {
    let group = apiMap.get(api.apiGroup);
    if (!group) {
      group = {
        ID: api.ID,
        path: `group:${api.apiGroup}`, // A unique ID for the parent group
        description: api.apiGroup, // The display name for the group
        children: [], // Initialize children array
      };
      apiMap.set(api.apiGroup, group);
    }

    group.children.push(api);
  });

  return Array.from(apiMap.values());
};
const flattenArray = (arr: any[]): any[] => {
  return arr.flatMap((node) => {
    if (node) {
      return [node, ...(node.children || [])];
    }
    return [node];
  });
};

export { buildMenuTree, apisToTree, flattenArray };
