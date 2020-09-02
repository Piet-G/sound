// Copyright 2020, University of Colorado Boulder

/**
 * @author Piet Goris
 */
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import Color from '../../../../scenery/js/util/Color.js';

import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SoundConstants from '../../common/SoundConstants.js';
import SoundControlPanel from '../../common/SoundControlPanel.js';
import AudioControlPanel from '../../common/AudioControlPanel.js';
import SoundModeControlPanel from '../../common/SoundModeControlPanel.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import sound from '../../sound.js';
import SoundModel from '../model/SoundModel.js';
import SpeakerNode from '../../common/view/SpeakerNode.js';
import GaugeNode from '../../../../scenery-phet/js/GaugeNode.js';

import WaveInterferenceConstants from '../../../../wave-interference/js/common/WaveInterferenceConstants.js';
import LatticeCanvasNode from '../../common/view/LatticeCanvasNode.js';
import WaveAreaNode from '../../../../wave-interference/js/common/view/WaveAreaNode.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';

// constants
const MARGIN = WaveInterferenceConstants.MARGIN;
const SPACING = 6;
const WAVE_MARGIN = 8; // Additional margin shown around the wave lattice
//const MAJOR_TICK_WIDTH = 20; // in model coordinate frame
//const WATER_BLUE = WaveInterferenceConstants.WATER_SIDE_COLOR;

class SoundScreenView extends ScreenView {

  /**
   * @param {SoundModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof SoundModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( {
      tandem: tandem
    } );

    // @private - shows the background of the wave area for sound view and used for layout
    this.waveAreaNode = new WaveAreaNode( {
        top: MARGIN + WAVE_MARGIN + 15,
        centerX: this.layoutBounds.centerX - 142
      } );
    this.addChild( this.waveAreaNode );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - SoundConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - SoundConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    this.canvasNode = new LatticeCanvasNode( model.lattice, model.lattice2, { baseColor: Color.white, reflection: typeof model.wallPositionXProperty !== 'undefined'} );

    const latticeScale = this.waveAreaNode.width / this.canvasNode.width;
    this.canvasNode.mutate( {
        scale: latticeScale,
        center: this.waveAreaNode.center,
        visible: true
    }  );

    this.addChild(this.canvasNode);

    this.contolPanelAlignGroup =  new AlignGroup({
      matchVertical: false
    });

    this.controlPanel = new SoundControlPanel(model, this.contolPanelAlignGroup);

    const updateControlPanelPosition = () => {
      this.controlPanel.mutate( {
        right: this.layoutBounds.right - MARGIN,
        top: 0 + SPACING
      } );
    };
    updateControlPanelPosition();
    this.addChild(this.controlPanel);

    if(model.isAudioEnabledProperty){
      this.audioControlPanel = new AudioControlPanel(model, this.contolPanelAlignGroup);

      const updateAudioControlPanelPosition = () => {
        this.audioControlPanel.mutate( {
          right: this.layoutBounds.right - MARGIN,
          top: this.controlPanel.bottom + SPACING
        } );
      };
      updateAudioControlPanelPosition();
      this.addChild(this.audioControlPanel);
    }


    // @public
    this.positionProperty = new Vector2Property( new Vector2(400, 400), {
      //tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    model.setViewBounds( this.waveAreaNode.bounds );

    // use the common ruler node
    //const width = modelViewTransform.modelToViewDeltaX( model.ruler.length );
    //const height = modelViewTransform.modelToViewDeltaY( model.ruler.height );
    //const majorTickWidth = modelViewTransform.modelToViewDeltaX( MAJOR_TICK_WIDTH );
    //this.modelViewTransform = ModelViewTransform2.createOffsetScaleMapping( new Vector2( 0, 0 ), 1 );

    //const rulerNodeB = new BLLRulerNode( model.ruler, modelViewTransform, tandem.createTandem( 'rulerNode' ) );

    //this.addChild( rulerNodeB);

    if(model.pressureProperty){
      const speakerCenter = model.modelViewTransform.modelToViewPosition(model.speaker1Position);
      const boxSizeX = 150;
      const boxSizeY = 200;
      const box = new Rectangle(speakerCenter.x - boxSizeX / 2, speakerCenter.y - boxSizeY / 2, boxSizeX, boxSizeY, {
        stroke: '#f3d99b',
        lineWidth: 3
      });

      model.pressureProperty.link( prop => {
        box.setFill(new Color(0,0,0, 1 - prop));
      });

      this.addChild(box);

      const gauge = new GaugeNode(model.pressureProperty, "ATM", model.pressureProperty.range);
      gauge.centerX = speakerCenter.x;
      gauge.scale(0.4);
      gauge.bottom = speakerCenter.y - boxSizeY / 2;
      this.addChild(gauge);
    }

    this.speakerNode1 = new SpeakerNode(model.oscillatorProperty);
    console.log(model.speaker1Position);
    const viewPosition = model.modelViewTransform.modelToViewPosition( model.speaker1Position);
    viewPosition.setX(viewPosition.x + SoundConstants.SPEAKER_OFFSET);
    this.speakerNode1.setRightCenter(viewPosition);
    this.addChild(this.speakerNode1);

    //this.addChild(new MovableNode(model.))
      const timeControlNode = new TimeControlNode( model.isRunningProperty, {
      bottom: this.layoutBounds.bottom - MARGIN,
      centerX: this.waveAreaNode.centerX,
      //speedRadioButtonGroupOptions: {
        //labelOptions: {
        //  font: WaveInterferenceConstants.DEFAULT_FONT
        //}
      //},
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {

          // If we need to move forward further than one frame, call advanceTime several times rather than increasing the
          // dt, so the model will behave the same,
          // see https://github.com/phetsims/wave-interference/issues/254
          // and https://github.com/phetsims/wave-interference/issues/226
          listener: () => model.advanceTime( 1 / SoundConstants.EVENT_RATE, true )
        }
      }
    } );
      this.addChild(timeControlNode);
      this.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }
}

sound.register( 'SoundScreenView', SoundScreenView );
export default SoundScreenView;