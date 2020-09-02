// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows the main controls, including frequency/wavelength and amplitude.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';
import HSeparator from '../../../sun/js/HSeparator.js';

import soundStrings from '../soundStrings.js';
import sound from '../sound.js';
import WaveInterferenceConstants from '../../../wave-interference/js/common/WaveInterferenceConstants.js';
import PropertyControlSlider from './PropertyControlSlider.js';
import WaveInterferencePanel from '../../../wave-interference/js/common/view/WaveInterferencePanel.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';

const amplitudeString = soundStrings.amplitude;
const frequencyString = soundStrings.frequency;
const clearString = soundStrings.measure.clearWaves;

class SoundControlPanel extends WaveInterferencePanel {

  /**
   * @param {WavesModel} model
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   */
  constructor( model, alignGroup, options ) {

    options = merge( {

      // {Node|null} This additional control (if present) will be shown beneath the Amplitude slider in the
      // WaveInterferenceControlPanel
      additionalControl: null,

      showIntensityCheckbox: true,
      maxWidth: WaveInterferenceConstants.PANEL_MAX_WIDTH,
      yMargin: 4,
      showSceneRadioButtons: true,
      showPlaySoundControl: false,
      audioEnabled: true
    }, options );

    const frequencyControl = new PropertyControlSlider( frequencyString, model.frequencyProperty, {
      valueToText: value => (Math.round(value * 1000)).toString() + ' Hz'
    });
    const amplitudeControl = new PropertyControlSlider( amplitudeString, model.amplitudeProperty );

    const centerX = frequencyControl.centerX;
    frequencyControl.centerX = centerX;
    amplitudeControl.centerX = centerX;

    // Vertical layout
    amplitudeControl.top = frequencyControl.bottom + 7;

    const container = new Node();

    const clearButton = new RectangularPushButton({
      listener: () => {
        model.clearWaves();
      },
      content: new Text(clearString)
    });

    clearButton.top = amplitudeControl.bottom + 7;
    const separator = new HSeparator( frequencyControl.width );
    separator.top = amplitudeControl.bottom + 7;
    separator.centerX = centerX;

    clearButton.top = separator.bottom + 7;
    clearButton.centerX = centerX;

    container.children = [
        frequencyControl,
        amplitudeControl,
        ...( model.stopwatch ? [separator, clearButton ] : [] )
      ];

    const content = alignGroup.createBox( container );

    super( content, options );
  }
}

sound.register( 'SoundControlPanel', SoundControlPanel );
export default SoundControlPanel;