// Copyright 2018-2020, University of Colorado Boulder

/**
 * Controls the amplitude for each Scene.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Node from '../../../scenery/js/nodes/Node.js';
import sound from '../sound.js';
import WaveInterferenceUtils from '../../../wave-interference/js/common/WaveInterferenceUtils.js';
import SoundSlider from '../common/view/SoundSlider.js';
import Text from '../../../scenery/js/nodes/Text.js';
import merge from '../../../phet-core/js/merge.js';

class ProtertyControlSlider extends Node {

  /**
   * @param {WavesModel} model
   */
  constructor(titleText, property, options) {
    options = merge( {
      valueToText: null
    }, options);

    const title = new Text(titleText);
    const valueDisplay = new Text('TEST');
    valueDisplay.top = title.bottom + 5;

    const sliderContainer =  new SoundSlider(property);
    sliderContainer.centerX = title.centerX;
    sliderContainer.top = (options.valueToText ? valueDisplay.bottom : title.bottom) + WaveInterferenceUtils.getSliderTitleSpacing( title );
    valueDisplay.right = sliderContainer.right;

    if(options.valueToText){
      property.link(value => {
        valueDisplay.setText(options.valueToText(value));
        valueDisplay.right = sliderContainer.right;
      });
    }

    super( {
      children: [ title,
                  ...(options.valueToText ? [valueDisplay] : []),
                  sliderContainer ]
    } );


  }
}

sound.register( 'ProtertyControlSlider', ProtertyControlSlider );
export default ProtertyControlSlider;