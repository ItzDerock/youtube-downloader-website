// no redis support since i want this to be an all-in-one type of app with no extra dependencies

import NodeCache from "node-cache";
const cache = new NodeCache();

export default cache;