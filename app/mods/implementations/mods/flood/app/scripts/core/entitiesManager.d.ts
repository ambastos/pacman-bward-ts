import { Container } from "pixi.js";
import Wave from "./wave.ts";
import GameCoordinator from "../../../../../../../scripts/core/gameCoordinator.ts";
import MovableEntity from "../../../../../../../scripts/characters/movableEntity.ts";
declare class EntitiesManager {
    gc: GameCoordinator;
    queuedList: EntityDefs[];
    entitiesDef: EntityDefs[];
    container: Container;
    constructor(gc: GameCoordinator);
    restart(): void;
    tryToGenerateEntities(wave: Wave | null): void;
    dequeAllEntities(): void;
    queueEntity(entity: EntityDefs): void;
    dequeEntitiesBy(name?: string): EntityDefs[];
    addEntityDef(entityDef: EntityDefs): void;
    clearEntities(): void;
    hide(): void;
    stop(): void;
    update(elapsedMs: number): void;
}
export default EntitiesManager;
type EntityDefs = {
    entity: MovableEntity;
    timeAdded?: number;
    startAppearsInMs: number;
};
//# sourceMappingURL=entitiesManager.d.ts.map