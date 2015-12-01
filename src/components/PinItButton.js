import React from 'react';

import PinterestBase from './PinterestBase';
import Anchor from './PinterestAnchor';

import Config from '../util/PinConfig';
import Const from '../util/PinConst';
import Util from '../util/PinUtil';

/**
 * This is the classic Pin It button, with several optional props. The
 * default state is a small, rectangular, gray button.
 *
 * <PinItButton type="any" color="white" large={true}/>
 *
 * @prop {string} type - enum of { any, one }: default 'any'
 * @prop {string} color - enum of { red, white, grey }: default grey
 * @prop {boolean} large - is large sized button: default false
 * @prop {boolean} round - is circular button: default false

 * For type="one" you can either repin or create a new Pin
 * @prop {string} pin - the id of the Pin to repin
 * @prop {string} media - the image url of the Pin to create
 * @prop {string} url - the link back of the Pin to create
 * @prop {string} description - the description of the Pin to create
 */
export default class PinItButton extends PinterestBase {

    constructor(props) {
        super(props);
        this.logCount(Const.COUNT.BUTTON);
    }

    /**
     * Build the url for the button image based on the color, size, and shape
     * @returns {string} the url for the button's image
     */
    getButtonImage() {
        const { color, large, round } = this.props;
        const shape = round ? 'round' : 'rect';
        const size = round ? (large ? '32' : '16') : (large ? '28' : '20');
        const _color = round ? 'red' : color;
        const resolution = Util.getResolution();
        return `//s-passets.pinimg.com/images/pidgets/pinit_bg_en_${shape}_${_color}_${size}_${resolution}.png`;
    }

    /**
     * Build the classname dynamically based on requested size and shape
     * @returns {string} the classname to be applied
     */
    getClasses() {
        return (
            'pinterest-pinit-button ' + 
            (this.props.large ? 'pinit-button--large ' : '') +
            (this.props.round ? 'pinit-button--round' : '')
        );
    }

    /**
     * Build the inline style for the icon
     * @returns {object} the inline style object for the button
     */
    getButtonStyle() {
        return { backgroundImage: `url(${this.getButtonImage()})` };
    }

    /**
     * Download the bookmarklet code to open the image picker for pinning any valid image
     * @param {event} evt - the corresponding click event
     */
    pinAny(evt) {
        evt.preventDefault();
        var url = Const.URL.PINMARKLET + '?r=' + Math.random() * 99999999;
        Util.loadScript(url, { pinMethod: 'button' });
        Util.log({ type: 'button_pinit_bookmarklet', href: Const.URL.PIN_CREATE});
    }

    /**
     * Render helper for a pin one button
     * @returns {JSX}
     */
    renderPinOne() {
        const {pin, media, url, description} = this.props;
        let href;
        if (pin) {
            href = Const.URL.REPIN.replace('<id>', pin) + `?guid=${Config.guid}`;
        } else {
            href = Const.URL.PIN_CREATE + `?guid=${Config.guid}`;
            href += `&media=${encodeURIComponent(media)}`;
            href += `&url=${encodeURIComponent(url || document.URL)}`;
            href += `&description=${encodeURIComponent(description || document.title)}`;
        }
        return (
            <Anchor className={this.getClasses()} href={href} log="button_pinit" popup="pin_create" >
                <i style={this.getButtonStyle()} ></i>
            </Anchor>
        );
    }

    /**
     * Render helper for a pin any button
     * @returns {JSX}
     */
    renderPinAny() {
        return (
            <a className={this.getClasses()} href={Const.URL.PIN_CREATE} onClick={this.pinAny.bind(this)} >
              <i style={this.getButtonStyle()} ></i>
            </a>
        );
    }

    /**
     * Render method. Deviates in href and click handler based on
     * the <type> of the Pin It button.
     */
    render() {
        const classes = this.getClasses();
        if (this.props.type === 'one') {
            if (this.props.pin || this.props.media) {
                return this.renderPinOne();
            } else {
                console.warn('PinItButton with type="one" requires <pin> or <media>');
                return this.renderPinAny();
            }
        } else {
            return this.renderPinAny();
        }
    }

}

PinItButton.propTypes = {
  type: React.PropTypes.string,
  color: React.PropTypes.string,
  large: React.PropTypes.bool,
  round: React.PropTypes.bool,
  pin: React.PropTypes.string,
  media: React.PropTypes.string,
  url: React.PropTypes.string,
  description: React.PropTypes.string
};

PinItButton.defaultProps = {
    type: 'any',
    color: 'gray',
    large: false,
    round: false,
    pin: null,
    media: null,
    url: '',
    description: ''
};
