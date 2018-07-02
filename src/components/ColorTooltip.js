import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from "./ColorTooltip.scss"

class ColorTooltip extends Component {

    static propTypes = {
        content: PropTypes.string,
    }

    static defaultProps = {
        content: ""
    }

    state = {
        text: this.props.content,
        copied: false
    }

    onMouseEnter = () => {
        this.setState({
            text: "Copy Hex"
        })
    }

    onMouseLeave = () => {
        this.setState({
            text: this.props.content
        })
    }

    onClick = e => {
        e.stopPropagation()
        const { content } = this.props
        const temp = document.createElement("input")
        const body = document.body
        body.appendChild(temp)
        temp.value = content
        temp.select()
        document.execCommand("copy")
        body.removeChild(temp)
        this.setState({
            copied: true,
            text: "Copied"
        })

    }

    render () {
        const { content } = this.props
        const { text, copied } = this.state
        return <div
            className={styles.wrapper}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onClick}
            style={{
                width: text === content ? "66px" : copied ? "65px" : "79px"
            }}
        >
            {
                text
            }
        </div>
    }
}
export default ColorTooltip
