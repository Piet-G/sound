// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shows the main controls, including frequency/wavelength and amplitude.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Node from '../../../scenery/js/nodes/Node.js';
import Text from '../../../scenery/js/nodes/Text.js';import soundStrings from '../soundStrings.js';
import sound from '../sound.js';
import WaveInterferenceConstants from '../../../wave-interference/js/common/WaveInterferenceConstants.js';
import WaveInterferencePanel from '../../../wave-interference/js/common/view/WaveInterferencePanel.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
//import SoundModel from '../sound/model/SoundModel.js';
import PropertyControlSlider from './PropertyControlSlider.js';

const titleString = soundStrings.airDensityControlPanel.title;
//const removeAirString = soundStrings.airDensityControlPanel.removeAir;
//const addAirString = soundStrings.airDensityControlPanel.addAir;
const resetString = soundStrings.airDensityControlPanel.reset;

class AirDensityControlPanel extends WaveInterferencePanel {

  /**
   * @param {SoundModel} model
   * @param {AlignGroup} alignGroup
   */
  constructor( model, alignGroup) {
    const boxText = new Text(titleString);

    const container = new Node();

    const resetButton = new RectangularPushButton({
      content: new Text(resetString),
      listener: () => {
        model.pressureProperty.set(1);
      }
    });

    const airPressureContol = new PropertyControlSlider( "Air Pressure", model.pressureProperty);

    container.children = [
    //    boxText,
        airPressureContol,
        resetButton
      ];

    //airPressureContol.top = boxText.bottom + 4;
    resetButton.top = airPressureContol.bottom + 4;

    const content = alignGroup.createBox( container );
    content.setXAlign('left');

    super( content, {
      maxWidth: WaveInterferenceConstants.PANEL_MAX_WIDTH,
      yMargin: 7
    });
  }
}

sound.register( 'AirDensityControlPanel', AirDensityControlPanel );
export default AirDensityControlPanel;