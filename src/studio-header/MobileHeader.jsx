// This file was copied from edx/frontend-component-header-edx.
import React from 'react';
import PropTypes from 'prop-types';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import Avatar from './Avatar';
// i18n
import messages from './Header.messages';
// Assets
import { MenuIcon } from './Icons';
import { LinkedLogo, Logo } from './Logo';
// Local Components
import { Menu, MenuContent, MenuTrigger } from './Menu';

class MobileHeader extends React.Component {
  constructor(props) { // eslint-disable-line no-useless-constructor
    super(props);
  }

  renderMainMenu() {
    const { mainMenu } = this.props;

    // Nodes are accepted as a prop
    if (!Array.isArray(mainMenu)) {
      return mainMenu;
    }

    return mainMenu.map((menuItem) => {
      const {
        type,
        href,
        content,
        submenuContent,
      } = menuItem;

      if (type === 'item') {
        return (
          <a key={`${type}-${content}`} className="nav-link" href={href}>
            {content}
          </a>
        );
      }

      return (
        <Menu key={`${type}-${content}`} tag="div" className="nav-item">
          <MenuTrigger tag="a" role="button" tabIndex="0" className="nav-link">
            {content}
          </MenuTrigger>
          <MenuContent className="position-static pin-left pin-right py-2">
            {submenuContent}
          </MenuContent>
        </Menu>
      );
    });
  }

  renderUserMenuItems() {
    const { userMenu } = this.props;

    return userMenu.map(({ type, href, content }) => (
      <li className="nav-item" key={`${type}-${content}`}>
        <a className="nav-link" href={href}>{content}</a>
      </li>
    ));
  }

  render() {
    const {
      logo,
      logoAltText,
      logoDestination,
      avatar,
      username,
      stickyOnMobile,
      mainMenu,
      intl,
    } = this.props;
    const logoProps = { src: logo, alt: logoAltText, href: logoDestination };
    const stickyClassName = stickyOnMobile ? 'sticky-top' : '';
    return (
      <header
        aria-label={intl.formatMessage(messages['header.label.main.header'])}
        className={`site-header-mobile d-flex justify-content-between align-items-center shadow ${stickyClassName}`}
      >
        <div className="w-100 d-flex justify-content-start">
          {mainMenu.length > 0
            ? (
              <Menu className="position-static">
                <MenuTrigger
                  tag="button"
                  className="icon-button"
                  aria-label={intl.formatMessage(messages['header.label.main.menu'])}
                  title={intl.formatMessage(messages['header.label.main.menu'])}
                >
                  <MenuIcon role="img" aria-hidden focusable="false" style={{ width: '1.5rem', height: '1.5rem' }} />
                </MenuTrigger>
                <MenuContent
                  tag="nav"
                  aria-label={intl.formatMessage(messages['header.label.main.nav'])}
                  className="nav flex-column pin-left pin-right border-top shadow py-2"
                >
                  {this.renderMainMenu()}
                </MenuContent>
              </Menu>
            ) : null}
        </div>
        <div className="w-100 d-flex align-items-center mobile-lockup">
          {logoDestination === null ? <Logo className="logo" src={logo} alt={logoAltText} /> : <LinkedLogo className="logo" {...logoProps} itemType="http://schema.org/Organization" />}
          { this.props.courseLockUp }
        </div>
        <div className="w-100 d-flex justify-content-end align-items-center">
          <Menu tag="nav" aria-label="Secondary" className="position-static">
            <MenuTrigger
              tag="button"
              className="icon-button"
              aria-label={intl.formatMessage(messages['header.label.account.menu'])}
              title={intl.formatMessage(messages['header.label.account.menu'])}
            >
              <Avatar size="1.5rem" src={avatar} alt={username} />
            </MenuTrigger>
            <MenuContent tag="ul" className="nav flex-column pin-left pin-right border-top shadow py-2">
              {this.renderUserMenuItems()}
            </MenuContent>
          </Menu>
        </div>
      </header>
    );
  }
}

MobileHeader.propTypes = {
  mainMenu: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array,
  ]),

  userMenu: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['item', 'menu']),
    href: PropTypes.string,
    content: PropTypes.string,
  })),
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  logoDestination: PropTypes.string,
  avatar: PropTypes.string,
  username: PropTypes.string,
  stickyOnMobile: PropTypes.bool,
  courseLockUp: PropTypes.node.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

MobileHeader.defaultProps = {
  mainMenu: [],
  userMenu: [],
  logo: null,
  logoAltText: null,
  logoDestination: null,
  avatar: null,
  username: null,
  stickyOnMobile: true,
};

export default injectIntl(MobileHeader);
