const entityTypeIds: Record<string, Function> = {};

export function getEntityTypeId<T>(ctor: { new (...args: any[]): T }): string {
  const entityTypeId = Reflect.getMetadata("entityTypeId", ctor);
  return entityTypeId;
}

export function EntityType(entityTypeId: string) {
  return (target: any) => {
    entityTypeIds[entityTypeId] = target;
    Reflect.defineMetadata("entityTypeId", entityTypeId, target);
  };
}
export function getEntityTypeFromId(value: string): Function | undefined {
  return entityTypeIds[value];
}
