// Copyright 2020, University of Colorado Boulder

/**
 * @author Piet Goris
 * View for the pressure screen.
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import listenerImage from '../../../images/girl_png.js';
import SoundConstants from '../../common/SoundConstants.js';
import AirDensityControlPanel from '../../common/view/AirDensityControlPanel.js';
import sound from '../../sound.js';
import PressureModel from '../model/PressureModel.js';
import SoundScreenView from './SoundScreenView.js';

class PressureView extends SoundScreenView {
  constructor(model) {
    assert && assert( model instanceof PressureModel, 'invalid model' );
    super(model);

    const center = model.modelViewTransform.modelToViewPosition(model.listenerPositionProperty.value);
    this.listener = new Image(listenerImage);
    this.listener.setCenter(center);
    this.addChild(this.listener);
    
    this.pressureControlPanel = new AirDensityControlPanel(model, this.contolPanelAlignGroup);
    
    this.pressureControlPanel.mutate( {
      right: this.layoutBounds.right - SoundConstants.CONTROL_PANEL_MARGIN,
      top: this.audioControlPanel.bottom + SoundConstants.CONTROL_PANEL_SPACING
    } );
    
    this.addChild(this.pressureControlPanel);
  }
}

sound.register( 'PressureView', PressureView );
export default PressureView;