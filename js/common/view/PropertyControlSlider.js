// Copyright 2018-2020, University of Colorado Boulder

/**
 * Slider that controls a given property, can display the current value and a title.
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import WaveInterferenceUtils from '../../../../wave-interference/js/common/WaveInterferenceUtils.js';
import SoundSlider from '../../common/view/SoundSlider.js';
import sound from '../../sound.js';

class ProtertyControlSlider extends Node {
  constructor(titleText, property, options) {
    options = merge( {
      valueToText: null
    }, options);

    const title = new Text(titleText);
    const valueDisplay = new Text('');
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