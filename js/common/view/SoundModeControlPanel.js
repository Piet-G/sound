// Copyright 2018-2020, University of Colorado Boulder

/**
 * Controls for the sound mode, whether the speaker emits waves contiously or pulse on button press.
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import WaveInterferencePanel from '../../../../wave-interference/js/common/view/WaveInterferencePanel.js';
import WaveInterferenceConstants from '../../../../wave-interference/js/common/WaveInterferenceConstants.js';
import SoundConstants from '../../common/SoundConstants.js';
import sound from '../../sound.js';
import SoundModel from '../../sound/model/SoundModel.js';
import soundStrings from '../../soundStrings.js';

const titleString = soundStrings.soundModeControlPanel.title;
const continuousOptionString = soundStrings.soundModeControlPanel.continuous;
const pulseOptionString = soundStrings.soundModeControlPanel.pulse;
const firePulseString = soundStrings.soundModeControlPanel.firePulse;

class SoundModeControlPanel extends WaveInterferencePanel {

  /**
   * @param {SoundModel} model
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   */
  constructor( model, alignGroup, options) {
    options = merge({
      maxWidth: WaveInterferenceConstants.PANEL_MAX_WIDTH,
      yMargin: 4
    }, options);

    const boxText = new Text(titleString);

    const radioButtons = new VerticalAquaRadioButtonGroup(model.soundModeProperty, [ {
      node: new Text(continuousOptionString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),
      value: SoundModel.SoundModeOptions.CONTINUOUS
    }, {
      node: new Text(pulseOptionString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),
      value: SoundModel.SoundModeOptions.PULSE
    }], {
      spacing: options.yMargin
    } );

    const container = new Node();
    radioButtons.top = boxText.bottom + SoundConstants.CONTROL_PANEL_SPACING;

    const firePulseButton = new RectangularPushButton({
      content: new Text(firePulseString),
      listener: () => model.startPulse()
    });

    firePulseButton.top = radioButtons.bottom + SoundConstants.CONTROL_PANEL_SPACING;

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

    super( content, options);
  }
}

sound.register( 'SoundModeControlPanel', SoundModeControlPanel );
export default SoundModeControlPanel;