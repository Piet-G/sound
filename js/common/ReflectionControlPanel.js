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

class ReflectionControlPanel extends WaveInterferencePanel {

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

    const wallPositionXControl = new PropertyControlSlider( 'Position', model.wallPositionXProperty );
    const wallAngleControl = new PropertyControlSlider( 'Rotation', model.wallAngleProperty );

    const centerX = wallPositionXControl.centerX;
    wallAngleControl.centerX = centerX;

    // Vertical layout
    wallAngleControl.top = wallPositionXControl.bottom + options.yMargin;

    const container = new Node();

    // Update when the scene changes.  Add and remove children so that the panel changes size (has resize:true)
    /**model.sceneProperty.link( scene => {

      // z-ordering
      container.children = [
        frequencyControl,
        amplitudeControl
      ];
    } );**/

    container.children = [
        wallPositionXControl,
        wallAngleControl
      ];

    const content = alignGroup.createBox( container );

    super( content, options );
  }
}

sound.register( 'ReflectionControlPanel', ReflectionControlPanel );
export default ReflectionControlPanel;