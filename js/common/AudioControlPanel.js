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
import Checkbox from '../../../sun/js/Checkbox.js';
import SoundModel from '../sound/model/SoundModel.js';

const titleString = soundStrings.audioControlPanel.title;
const audioEnabledString = soundStrings.audioControlPanel.audioEnabled;
const speakerAudioString = soundStrings.audioControlPanel.speaker;
const listenerAudioString = soundStrings.audioControlPanel.listener;
const SPACING = 7;

class AudioControlPanel extends WaveInterferencePanel {

  /**
   * @param {SoundModel} model
   * @param {AlignGroup} alignGroup
   */
  constructor( model, alignGroup) {
    const boxText = new Text(titleString);
    const graphCheckbox = new Checkbox(
      new Text(audioEnabledString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),
      model.isAudioEnabledProperty, {
        boxWidth: 15
        // Set size to the same as that of the radiobuttons.
      });

    graphCheckbox.top = boxText.bottom + SPACING;

    let radioButtons;
    if(model.audioControlSettingProperty){
      radioButtons = new VerticalAquaRadioButtonGroup(model.audioControlSettingProperty, [ {
        node: new Text(speakerAudioString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),
        value: SoundModel.AudioControlOptions.SPEAKER
      }, {
        node: new Text(listenerAudioString, WaveInterferenceConstants.CONTROL_PANEL_TEXT_MAX_WIDTH_OPTIONS ),
        value: SoundModel.AudioControlOptions.LISTENER
      }], {
        spacing: 4
      } );

      radioButtons.top = graphCheckbox.bottom + SPACING;
    }
    

    const container = new Node();

    container.children = [
        boxText,
        graphCheckbox,
        ...(model.audioControlSettingProperty ? [radioButtons] : [])
      ];

    const content = alignGroup.createBox( container );
    content.setXAlign('left');

    super( content, {
      maxWidth: WaveInterferenceConstants.PANEL_MAX_WIDTH,
      yMargin: 4
    });
  }
}

sound.register( 'AudioControlPanel', AudioControlPanel );
export default AudioControlPanel;