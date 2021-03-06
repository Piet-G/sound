// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows the controls for the reflection wall, its position and rotation.
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import WaveInterferencePanel from '../../../../wave-interference/js/common/view/WaveInterferencePanel.js';
import WaveInterferenceConstants from '../../../../wave-interference/js/common/WaveInterferenceConstants.js';
import sound from '../../sound.js';
import soundStrings from '../../soundStrings.js';
import PropertyControlSlider from './PropertyControlSlider.js';

const positionSliderString = soundStrings.reflectionControlPanel.positionSlider;
const rotationSliderString = soundStrings.reflectionControlPanel.rotationSlider;

class ReflectionControlPanel extends WaveInterferencePanel {

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

    const wallPositionXControl = new PropertyControlSlider( positionSliderString, model.wallPositionXProperty );
    const wallAngleControl = new PropertyControlSlider(rotationSliderString , model.wallAngleProperty );

    const centerX = wallPositionXControl.centerX;
    wallAngleControl.centerX = centerX;

    // Vertical layout
    wallAngleControl.top = wallPositionXControl.bottom + options.yMargin;

    const container = new Node();

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