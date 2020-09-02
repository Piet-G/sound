// Copyright 2017-2020, University of Colorado Boulder

/**
 * Renders the main area of the lattice (doesn't include the damping regions) using 2d canvas.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import Color from '../../../../scenery/js/util/Color.js';
import sound from '../../sound.js';
import WaveInterferenceConstants from '../../../../wave-interference/js/common/WaveInterferenceConstants.js';
import WaveInterferenceUtils from '../../../../wave-interference/js/common/WaveInterferenceUtils.js';
import ImageDataRenderer from '../../../../wave-interference/js/common/view/ImageDataRenderer.js';

// constants
const CUTOFF = 0.4;

class LatticeCanvasNode extends CanvasNode {

  /**
   * @param {Lattice} lattice
   * @param {Object} [options]
   */
  constructor( lattice, lattice2, options) {

    options = merge( {

      // only use the visible part for the bounds (not the damping regions)
      canvasBounds: WaveInterferenceUtils.getCanvasBounds( lattice ),
      layerSplit: true, // ensure we're on our own layer
      baseColor: Color.blue,
      reflection: false

    }, options );

    super( options );

    // @private
    this.reflection = options.reflection;

    // @private
    this.lattice = lattice;

    this.lattice2 = lattice2;

    // @private
    this.wallPositionX = this.lattice.width / 2;

    // @private
    this.wallAngle = Math.PI/4;

    // @private
    this.baseColor = options.baseColor;

    // @public {Color|null} - settable, if defined shows unvisited lattice cells as specified color, used for light
    this.vacuumColor = null;

    // @private - For performance, render into a sub-canvas which will be drawn into the rendering context at the right
    // scale.
    this.imageDataRenderer = new ImageDataRenderer( lattice.visibleBounds.width, lattice.visibleBounds.height );

    // Invalidate paint when model indicates changes
    lattice.changedEmitter.addListener( this.invalidatePaint.bind( this ) );
  }

  /**
   * Convert the given point in the local coordinate frame to the corresponding i,j (integral) lattice coordinates.
   * @param {Vector2} point - point in the local coordinate frame
   * @returns {Vector2}
   * @public
   */
  static localPointToLatticePoint( point ) {
    return new Vector2(
      Utils.roundSymmetric( point.x / WaveInterferenceConstants.CELL_WIDTH ),
      Utils.roundSymmetric( point.y / WaveInterferenceConstants.CELL_WIDTH )
    );
  }

  /**
   * Sets the x coordinate of the reflection wall
   * @param {Number} x
   * @public
   */

  setWallPositionX(x) {
    this.wallPositionX = x;

    console.log("SET" + x)
  }

  /**
   * Sets the angle of the reflection wall
   * @param {Number} angle
   * @public
   */

  setWallAngle(angle) {
    this.wallAngle = angle;
  }

  /**
   * Sets the color of the peaks of the wave.
   * @param {Color} color
   * @public
   */
  setBaseColor( color ) {
    this.baseColor = color;
    this.invalidatePaint();
  }

  /**
   * Draws into the canvas.
   * @param {CanvasRenderingContext2D} context
   * @public
   * @override
   */
  paintCanvas( context ) {
    let m = 0;
    const data = this.imageDataRenderer.data;
    const dampX = this.lattice.dampX;
    const dampY = this.lattice.dampY;
    const width = this.lattice.width;
    const height = this.lattice.height;
    let intensity;

    //const halfWidth = Utils.roundSymmetric(this.lattice.width / 2);
    const halfWidth = Utils.roundSymmetric(this.wallPositionX);
    //console.log(halfWidth);
    for ( let i = dampX; i < width - dampX; i++ ) {
      for ( let k = dampY; k < height - dampY; k++ ) {

        // Note this is transposed because of the ordering of putImageData

        let addition = 0;
        let zeroOut = 1;

        if(this.reflection){
          //console.log(halfWidth)

          if(k < Utils.roundSymmetric(this.wallPositionX) - (i - height + dampY) / Math.tan(this.wallAngle)){
            //addition = 10;

            const originalPos = new Vector2(k, i);
            const wallVector = Vector2.createPolar(1, -this.wallAngle);
            const wallOrigin = new Vector2(this.wallPositionX, height - dampY);
            const mirroredPosition = wallVector.withMagnitude(originalPos.copy().minus(wallOrigin).dot(wallVector)).plus(wallOrigin);
            const perp = mirroredPosition.minus(originalPos).times(2);
            const final = originalPos.plus(perp);
            //console.log(final);
            addition = this.lattice.getInterpolatedValue( Utils.roundSymmetric(final.x), Utils.roundSymmetric(final.y) );
          }
          else{
            zeroOut = 0;
          }

          if(k < 50){
            zeroOut = 0;
          }
        }
        const extra = this.lattice2 ? this.lattice2.getInterpolatedValue( k, i ) : 0;
        const waveValue = (this.lattice.getInterpolatedValue( k, i ) + extra + addition / 2) * zeroOut;
       //const waveValue = i / 100;

        if ( waveValue > 0 ) {
          intensity = Utils.linear( 0, 2, CUTOFF, 1, waveValue );
          intensity = Utils.clamp( intensity, CUTOFF, 1 );

          //console.log("paining")

        }
        else {
          const MIN_SHADE = 0.03; // Stop before 0 because 0 is too jarring
          intensity = Utils.linear( -1.5, 0, MIN_SHADE, CUTOFF, waveValue );
          intensity = Utils.clamp( intensity, MIN_SHADE, CUTOFF );
        }

        // Note this interpolation doesn't include the gamma factor that Color.blend does
        let r = this.baseColor.red * intensity;
        let g = this.baseColor.green * intensity;
        let b = this.baseColor.blue * intensity;

        // Note this is transposed because of the ordering of putImageData
        if ( this.vacuumColor && !this.lattice.hasCellBeenVisited( k, i ) ) {
          r = this.vacuumColor.r;
          g = this.vacuumColor.g;
          b = this.vacuumColor.b;
        }

        // ImageData.data is Uint8ClampedArray.  Performance is critical and all numbers are non-negative.
        const offset = 4 * m;
        data[ offset ] = Math.round( r ); // eslint-disable-line bad-sim-text
        data[ offset + 1 ] = Math.round( g ); // eslint-disable-line bad-sim-text
        data[ offset + 2 ] = Math.round( b ); // eslint-disable-line bad-sim-text
        data[ offset + 3 ] = 255; // Fully opaque
        m++;
      }
    }
    this.imageDataRenderer.putImageData();

    // draw the sub-canvas to the rendering context at the appropriate scale
    context.save();
    context.transform( WaveInterferenceConstants.CELL_WIDTH, 0, 0, WaveInterferenceConstants.CELL_WIDTH, 0, 0 );
    context.drawImage( this.imageDataRenderer.canvas, 0, 0 );
    context.restore();
  }
}

sound.register( 'LatticeCanvasNode', LatticeCanvasNode );
export default LatticeCanvasNode;