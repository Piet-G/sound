// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows the main controls, including frequency/wavelength and amplitude.
 * Also displays a clear wave button when in the measure model.
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import soundStrings from '../../soundStrings.js';
import sound from '../../sound.js';
import WaveInterferenceConstants from '../../../../wave-interference/js/common/WaveInterferenceConstants.js';
import PropertyControlSlider from './PropertyControlSlider.js';
import WaveInterferencePanel from '../../../../wave-interference/js/common/view/WaveInterferencePanel.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import SoundConstants from '../../common/SoundConstants.js';
import Utils from '../../../../dot/js/Utils.js';

const amplitudeString = soundStrings.amplitude;
const frequencyString = soundStrings.frequency;
const clearString = soundStrings.measure.clearWaves;
const hzString = soundStrings.hz;

class SoundControlPanel extends WaveInterferencePanel {

  /**
   * @param {SoundModel} model
   * @param {AlignGroup} alignGroup
   * @param {Object} [options]
   */
  constructor( model, alignGroup, options ) {

    options = merge( {
      maxWidth: WaveInterferenceConstants.PANEL_MAX_WIDTH,
      yMargin: 4
    }, options );

    const frequencyControl = new PropertyControlSlider( frequencyString, model.frequencyProperty, {
      valueToText: value => (Utils.roundSymmetric(value * 1000)).toString() + hzString
    });
    const amplitudeControl = new PropertyControlSlider( amplitudeString, model.amplitudeProperty );

    const centerX = frequencyControl.centerX;
    frequencyControl.centerX = centerX;
    amplitudeControl.centerX = centerX;

    // Vertical layout
    amplitudeControl.top = frequencyControl.bottom + SoundConstants.CONTROL_PANEL_SPACING;

    const container = new Node();
    const clearButton = new RectangularPushButton({
      listener: () => {
        model.clearWaves();
      },
      content: new Text(clearString)
    });

    clearButton.top = amplitudeControl.bottom + SoundConstants.CONTROL_PANEL_SPACING;
    const separator = new HSeparator( frequencyControl.width );
    separator.top = amplitudeControl.bottom + SoundConstants.CONTROL_PANEL_SPACING;
    separator.centerX = centerX;

    clearButton.top = separator.bottom + SoundConstants.CONTROL_PANEL_SPACING;
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