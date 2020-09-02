// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows the main controls, including frequency/wavelength and amplitude.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VerticalAquaRadioButtonGroup from '../../../sun/js/VerticalAquaRadioButtonGroup.js';
import soundStrings from '../soundStrings.js';
import sound from '../sound.js';
import WaveInterferenceConstants from '../../../wave-interference/js/common/WaveInterferenceConstants.js';
import WaveInterferencePanel from '../../../wave-interference/js/common/view/WaveInterferencePanel.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import SoundModel from '../sound/model/SoundModel.js';


const titleString = soundStrings.soundModeControlPanel.title;
const continuousOptionString = soundStrings.soundModeControlPanel.continuous;
const pulseOptionString = soundStrings.soundModeControlPanel.pulse;
const firePulseString = soundStrings.soundModeControlPanel.firePulse;
const SPACING = 7;

class SoundModeControlPanel extends WaveInterferencePanel {

  /**
   * @param {SoundModel} model
   * @param {AlignGroup} alignGroup
   */
  constructor( model, alignGroup) {
    const boxText = new Text(titleString);

    const radioButtons = new VerticalAquaRadioButtonGroup(model.soundModeProperty, [ {
      node: new Text(continuousOptionString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),
      value: SoundModel.SoundModeOptions.CONTINUOUS
    }, {
      node: new Text(pulseOptionString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),
      value: SoundModel.SoundModeOptions.PULSE
    }], {
      spacing: 4
    } );

    const container = new Node();
    radioButtons.top = boxText.bottom + SPACING;

    const firePulseButton = new RectangularPushButton({
      content: new Text(firePulseString),
      listener: () => model.startPulse()
    });

    firePulseButton.top = radioButtons.bottom + SPACING;

    container.children = [
        boxText,
        radioButtons,
        firePulseButton
      ];

    firePulseButton.centerX = container.centerX;

    const updateEnabled = () => {
      firePulseButton.setEnabled(model.soundModeProperty.value !== SoundModel.SoundModeOptions.CONTINUOUS && !model.isPulseFiringProperty.value);
    };

    model.soundModeProperty.link(updateEnabled);

    model.isPulseFiringProperty.link(updateEnabled);

    const content = alignGroup.createBox( container );
    content.setXAlign('center');


    // The first button can trigger a pulse, or continuous wave, depending on the disturbanceTypeProperty
    //firePulseButton.lazyLink( isPressed => {
    //  model.handleButton1Toggled( isPressed );

      // Clear plane waves if the red button is deselected when paused.
      /**if ( this.waveSpatialType === Scene.WaveSpatialType.PLANE && !isPressed ) {
        this.setSourceValues();
        this.lattice.changedEmitter.emit();
        this.lattice2.changedEmitter.emit();

        this.combinedLattice.changedEmitter.emit();
      }**/
//    } );

    super( content, {
      maxWidth: WaveInterferenceConstants.PANEL_MAX_WIDTH,
      yMargin: 4
    });
  }
}

sound.register( 'SoundModeControlPanel', SoundModeControlPanel );
export default SoundModeControlPanel;