import assert from 'assert'
import sinon from 'sinon'
import Pickup from '../scripts/pickups/pickup.ts';

let pickup;
let pacman;
let gameCoordinator;

function makeTexture() {
  return {
    baseTexture: { valid: true },
    orig: { width: 16, height: 16 },
    on() { },
    off() { },
    once() { },
  };
}

beforeEach(() => {
  pacman = {
    position: { x: 10, y: 10 },
    measurement: 16,
    hitArea: { intersects: () => false },
  };

  gameCoordinator = {
    pacman,
    mazeDiv: { appendChild: () => { } },
    scaledTileSize: 8,
    scale: 1,
    emitter: {
      emit: sinon.fake(),
      on: sinon.fake(),
      off: sinon.fake(),
    },
    am: {
      getTexture: sinon.fake(() => makeTexture()),
    },
  };

  pickup = new Pickup('pacdot', 1, 1, 1, gameCoordinator as any);
});

describe('pickup', () => {
  describe('reset', () => {
    it('sets visibility according to type', () => {
      pickup.visible = false;

      pickup.type = 'pacdot';
      pickup.reset();
      assert.strictEqual(pickup.visible, true);

      pickup.type = 'fruit';
      pickup.reset();
      assert.strictEqual(pickup.visible, false);
    });
  });

  describe('setStyleMeasurements', () => {
    it('sets measurements for pacdots', () => {
      pickup.setStyleMeasurements('pacdot', 8, 1, 1, 1);

      assert.strictEqual(pickup.size, 2);
      assert.strictEqual(pickup.x, 12);
      assert.strictEqual(pickup.y, 12);
      assert.strictEqual(pickup.visible, true);
    });

    it('sets measurements for powerPellets', () => {
      pickup.setStyleMeasurements('powerPellet', 8, 1, 1, 1);

      assert.strictEqual(pickup.size, 8);
      assert.strictEqual(pickup.x, 10);
      assert.strictEqual(pickup.y, 10);
      assert.strictEqual(pickup.visible, true);
    });

    it('sets measurements for fruits', () => {
      pickup.type = 'fruit';
      pickup.setStyleMeasurements('fruit', 8, 1, 1, 100);

      assert.strictEqual(pickup.size, 16);
      assert.strictEqual(pickup.x, 8);
      assert.strictEqual(pickup.y, 8);
      assert.strictEqual(pickup.visible, false);
    });
  });

  describe('getFruitName', () => {
    it('returns the right fruit for each point value', () => {
      assert.strictEqual(pickup.getFruitName(100), 'cherry');
      assert.strictEqual(pickup.getFruitName(300), 'strawberry');
      assert.strictEqual(pickup.getFruitName(500), 'orange');
      assert.strictEqual(pickup.getFruitName(700), 'apple');
      assert.strictEqual(pickup.getFruitName(1000), 'melon');
      assert.strictEqual(pickup.getFruitName(2000), 'galaxian');
      assert.strictEqual(pickup.getFruitName(3000), 'bell');
      assert.strictEqual(pickup.getFruitName(5000), 'key');
    });

    it('returns undefined for an unrecognized point value', () => {
      assert.strictEqual(pickup.getFruitName(9999), undefined);
    });
  });

  describe('showFruit', () => {
    it('sets the point value, image, and visibility', () => {
      pickup.points = 0;
      pickup.visible = false;

      pickup.showFruit(100);
      assert.strictEqual(pickup.points, 100);
      assert.strictEqual(pickup.visible, true);
      assert(gameCoordinator.am.getTexture.calledWith('cherry'));
    });
  });

  describe('hideFruit', () => {
    it('sets the visibility to HIDDEN', () => {
      pickup.visible = true;

      pickup.hideFruit();
      assert.strictEqual(pickup.visible, false);
    });
  });

  describe('checkForCollision', () => {
    it('returns TRUE if the Pickup is colliding', () => {
      pickup.hitArea = { intersects: () => true } as any;

      assert(pickup.checkForCollision(pickup, pickup.pacman));
    });

    it('returns FALSE if it is not', () => {
      pickup.hitArea = { intersects: () => false } as any;

      assert(!pickup.checkForCollision(pickup, pickup.pacman));
    });
  });

  describe('checkPacmanProximity', () => {
    beforeEach(() => {
      pickup.center = { x: 0, y: 0 };
      pickup.visible = true;
    });

    it('returns TRUE if the pickup is close to Pacman', () => {
      pickup.checkPacmanProximity(5, { x: 3, y: 4 } as any);
      assert(pickup.nearPacman);
    });

    it('returns FALSE otherwise', () => {
      pickup.checkPacmanProximity(4.9, { x: 3, y: 4 } as any);
      assert(!pickup.nearPacman);
    });

    it('changes the tint when debugging', () => {
      pickup.checkPacmanProximity(5, { x: 3, y: 4 } as any, true);
      assert.strictEqual(pickup.tint, '0x00ff00');

      pickup.checkPacmanProximity(4.9, { x: 3, y: 4 } as any, true);
      assert.strictEqual(pickup.tint, '0xff0000');
    });

    it('skips execution if the pickup is hidden', () => {
      pickup.visible = false;
      pickup.nearPacman = false;

      pickup.checkPacmanProximity(5, { x: 3, y: 4 } as any);
      assert(!pickup.nearPacman);
    });
  });

  describe('shouldCheckForCollision', () => {
    it('only returns TRUE when the Pickup is near Pacman and visible', () => {
      pickup.visible = true;
      pickup.nearPacman = true;
      assert(pickup.shouldCheckForCollision());

      pickup.nearPacman = false;
      assert(!pickup.shouldCheckForCollision());

      pickup.visible = false;
      assert(!pickup.shouldCheckForCollision());

      pickup.nearPacman = true;
      assert(!pickup.shouldCheckForCollision());
    });
  });

  describe('update', () => {
    beforeEach(() => {
      global.window.dispatchEvent = sinon.fake();
    });

    it('turns the Pickup\'s visibility to HIDDEN after collision', () => {
      pickup.shouldCheckForCollision = sinon.fake.returns(true);
      pickup.checkForCollision = sinon.fake.returns(true);

      pickup.update(16);
      assert.strictEqual(pickup.visible, false);
    });

    it('leaves the Pickup\'s visibility until collision', () => {
      pickup.shouldCheckForCollision = sinon.fake.returns(true);
      pickup.checkForCollision = sinon.fake.returns(false);

      pickup.update(16);
      assert.notStrictEqual(pickup.visible, false);
    });

    it('emits the awardPoints event after a collision', () => {
      pickup.points = 100;
      pickup.shouldCheckForCollision = sinon.fake.returns(true);
      pickup.checkForCollision = sinon.fake.returns(true);

      pickup.update(16);
      assert(global.window.dispatchEvent.calledWith(
        new CustomEvent('awardPoints', {
          detail: {
            points: 100,
            type: 'pacdot',
          },
        }),
      ));
    });

    it('emits dotEaten event if a pacdot collides with Pacman', () => {
      pickup.type = 'pacdot';
      pickup.shouldCheckForCollision = sinon.fake.returns(true);
      pickup.checkForCollision = sinon.fake.returns(true);

      pickup.update(16);
      assert(global.window.dispatchEvent.calledWith(new Event('dotEaten')));
    });

    it('emits powerUp event if a powerPellet collides with Pacman', () => {
      pickup.type = 'powerPellet';
      pickup.shouldCheckForCollision = sinon.fake.returns(true);
      pickup.checkForCollision = sinon.fake.returns(true);

      pickup.update(16);
      assert(global.window.dispatchEvent.calledWith(new Event('dotEaten')));
      assert(global.window.dispatchEvent.calledWith(new Event('powerUp')));
    });

    it('does not emit dot events for an unrecognized item', () => {
      pickup.type = 'blah';
      pickup.shouldCheckForCollision = sinon.fake.returns(true);
      pickup.checkForCollision = sinon.fake.returns(true);

      pickup.update(16);
      assert(global.window.dispatchEvent.neverCalledWith(new Event('dotEaten')));
      assert(global.window.dispatchEvent.neverCalledWith(new Event('powerUp')));
    });

    it('does nothing if shouldCheckForCollision returns FALSE', () => {
      pickup.shouldCheckForCollision = sinon.fake.returns(false);
      pickup.checkForCollision = sinon.fake();

      pickup.update(16);
      assert(!pickup.checkForCollision.called);
    });
  });
});