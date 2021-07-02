
export default class QuadTreeService {
	constructor(config) {
        this.config = config;
		// Prime it
		getQuadTree();
	}
	
	public void populate() {
		Class<?> cls = quadTreeConfigHolder.getQuadTreeSettings().getSummaryFactoryClass();
		if(cls != null) {
			try {
				Method method = cls.getMethod("getSummaryFactory");
				quadTree = new QuadRoot((SummaryFactory)method.invoke(null), quadTreeConfigHolder.getQuadTreeSettings().getDepth());
				
				ZoomDepthStrategy.setMaxDepth(quadTreeConfigHolder.getQuadTreeSettings().getDepth());
				
				provisioningService.populate(quadTree);				
				
			} catch (NoSuchMethodException | SecurityException | InvocationTargetException| IllegalAccessException e) {
				throw new RuntimeException("Could not get summary factory", e);
			}
		}		
	}

	public void clear() {
		quadTree = null;
	}
	
	public synchronized QuadRoot getQuadTree() {
		if(quadTree == null) {
			populate();
		}
		return quadTree;
	}
}
