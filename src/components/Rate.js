import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import IconMpStar from 'componentPath/svgicons/mp/IconMpStar'

import styles from './Rate.scss'

class Rate extends Component {
    static propTypes = {
        value: PropTypes.number,
    }

    static defaultProps = {
        value: 0
    }

    render() {
        const {value, children, className, ...others} = this.props
        const cls = classNames(styles.rate, className)
        return (
            <div className={cls} {...others}>
                <IconMpStar size="16" color={value > 0 ? "#ffa305" : "#d3d4d6"} />
                <IconMpStar size="16" color={value > 1 ? "#ffa305" : "#d3d4d6"} />
                <IconMpStar size="16" color={value > 2 ? "#ffa305" : "#d3d4d6"} />
            </div>
        )
    }
}

export default Rate