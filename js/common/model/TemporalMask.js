// Copyright 2019-2020, University of Colorado Boulder

/**
 * Records on and off times of a single source, so that we can determine whether it could have contributed to the value
 * on the lattice at a later time.  This is used to prevent artifacts when the wave is turned off, and to restore
 * the lattice to black (for light), see https://github.com/phetsims/wave-interference/issues/258
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import sound from '../../sound.js';
import Lattice from '../../../../wave-interference/js/common/model/Lattice.js';
import Vector2 from '../../../../dot/js/Vector2.js';

class TemporalMask {

  constructor(wallPositionXProperty, wallAngleProperty, reflected, transformModel) {
    this.wallPositionXProperty = wallPositionXProperty;
    this.wallAngleProperty = wallAngleProperty;
    this.reflected = reflected;
    this.transformModel = transformModel;

    if(transformModel){
      console.log("TEMP: " + this.transformModel.modelToViewX(1600));
    }

    // @private - record of {isSourceOn: boolean, numberOfSteps: number, verticalLatticeCoordinate: number} of changes in wave disturbance sources.
    this.deltas = [];
  }

  /**
   * Set the current state of the model.  If this differs from the prior state type (in position or whether it is on)
   * a delta is generated.
   * @param {boolean} isSourceOn - true if the source is on, false if the source is off
   * @param {number} numberOfSteps - integer number of times the wave has been stepped on the lattice
   * @param {number} verticalLatticeCoordinate - vertical lattice coordinate
   * @public
   */
  set( isSourceOn, numberOfSteps, verticalLatticeCoordinate ) {
    const lastDelta = this.deltas.length > 0 ? this.deltas[ this.deltas.length - 1 ] : null;
    if ( this.deltas.length === 0 || lastDelta.isSourceOn !== isSourceOn || lastDelta.verticalLatticeCoordinate !== verticalLatticeCoordinate ) {

      // record a delta
      this.deltas.push( {
        isSourceOn: isSourceOn,
        numberOfSteps: numberOfSteps,
        verticalLatticeCoordinate: verticalLatticeCoordinate
      } );
    }
  }

  /**
   * Determines if the wave source was turned on at a time that contributed to the cell value
   * @param {number} horizontalLatticeCoordinate - horizontal coordinate on the lattice (i)
   * @param {number} verticalLatticeCoordinate - vertical coordinate on the lattice (j)
   * @param {number} numberOfSteps - integer number of times the wave has been stepped on the lattice
   * @returns {boolean}
   * @public
   */
  matches(horizontalSourceX, horizontalLatticeCoordinate, verticalLatticeCoordinate, numberOfSteps ) {

    // search to see if the source contributed to the value at the specified coordinate at the current numberOfSteps
    for ( let k = 0; k < this.deltas.length; k++ ) {
      const delta = this.deltas[ k ];
      if ( delta.isSourceOn ) {

        const horizontalDelta = horizontalSourceX - horizontalLatticeCoordinate;
        const verticalDelta = delta.verticalLatticeCoordinate - verticalLatticeCoordinate;
        const distance = Math.sqrt( horizontalDelta * horizontalDelta + verticalDelta * verticalDelta );

        // Find out when this delta is in effect
        const startTime = delta.numberOfSteps;
        const endTime = this.deltas[ k + 1 ] ? this.deltas[ k + 1 ].numberOfSteps : numberOfSteps;

        const theoreticalTime = numberOfSteps - distance / ( Lattice.WAVE_SPEED) ;

        const tempVec = this.reflected ? new Vector2(horizontalDelta, verticalDelta).rotate(2 * this.wallAngleProperty.value) : null;

        const insideCone = this.reflected ? Math.abs(Math.atan((tempVec.y) / (tempVec.x) ) )  <= Math.PI / 3: Math.abs(Math.atan(verticalDelta / horizontalDelta)) <= Math.PI/3;

        // if theoreticalDistance matches any time in this range, the cell's value was caused by the oscillators, and
        // not by a reflection or numerical artifact.  The tolerance is necessary because the actual group velocity
        // of the tip exceeds the theoretical speed, and the group velocity at the tail is lower than the theoretical
        // speed.  If the tolerance is too tight, this appears as an unnatural "clipping" of the wave area graph.
        const headTolerance = 2;
        const tailTolerance = 4;

        //if(this.reflected){
        //  if(insideCone){
            //console.log("SSSSS")
        //    return true;
        //  }
        //  else{
            //console.log("ZWOOPPPP")
            //return false;
        //  }
        //}
        //  else{
        //    return false;
        //  }
          //return true;
        //}

        const notBack = this.reflected ? true : horizontalDelta < 0;

        const beforeWall = this.wallPositionXProperty ? horizontalLatticeCoordinate < this.transformModel.modelToViewX(this.wallPositionXProperty.value) + (verticalLatticeCoordinate - 131) / Math.tan(-this.wallAngleProperty.value) : true;

        if (notBack  && ((theoreticalTime >= startTime - headTolerance && theoreticalTime <= endTime + tailTolerance) || false) && insideCone && beforeWall) {

          // Return as early as possible to improve performance
          return true;
        }

        /**if(this.wallPositionXProperty && this.wallAngleProperty){

          if(horizontalDelta < 10){
            return true;
          }
          //console.log(horizontalDelta)
          //console.log(verticalDelta / Math.tan(this.wallAngleProperty.value) + this.wallPositionXProperty.value);
          if(horizontalDelta > verticalDelta / Math.tan(this.wallAngleProperty.value) + this.wallPositionXProperty.value){
            return true;
          }
        }**/
      }
    }

    return false;
  }

  /**
   * Remove delta values that are so old they can no longer impact the model, to avoid memory leaks and too much CPU
   * @param {number} maxDistance - the furthest a point can be from a source
   * @param {number} numberOfSteps - integer number of times the wave has been stepped on the lattice
   * @public
   */
  prune( maxDistance, numberOfSteps ) {

    // Save enough deltas so that even if the user toggles the source on and off rapidly, the effect will be further
    // from the source.  But don't save so many deltas that performance is degraded.
    // See https://github.com/phetsims/wave-interference/issues/319
    while ( this.deltas.length > 10 ) {
      this.deltas.shift(); // remove oldest deltas first
    }
  }

  /**
   * Clear the state.
   * @public
   */
  clear() {
    this.deltas.length = 0;
  }
}

sound.register( 'TemporalMask', TemporalMask );
export default TemporalMask;