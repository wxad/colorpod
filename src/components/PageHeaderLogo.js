import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './PageHeaderLogo.scss'
import logo from "../assets/img/logo.svg"

class PageHeaderLogo extends Component {
    static propTypes = {
        subTitle: PropTypes.string,
    }

    static defaultProps = {
        subTitle: ""
    }

    render() {
        const {subTitle, children, className, ...others} = this.props
        const cls = classNames(styles.logo, className)
        return (
            <div className={cls} {...others}>
                <h1 className={styles.h1}>
                    <img src={logo} alt="微信广告" />
                </h1>
                <h2 className={styles.h2}>{ subTitle }</h2>
            </div>
        )
    }
}

export default PageHeaderLogo