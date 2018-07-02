import React, { Component } from 'react'
import classNames from 'classnames'
import { Slider } from 'antd'
import "antd/lib/slider/style"
import { PhotoshopPicker } from 'react-color'
import chroma from "chroma-js"
import Chart from "chart.js"
import ColorTooltip from "./components/ColorTooltip"
import styles from './App.scss'

class App extends Component {

    state = {
    	sliderValue: 10,
    	palettes: [
    		"#1AAD19",
    		"#10A17E",
    		"#4499E9",
    		"#7E50A3",
    		"#E64E4E",
    		"#D94801",
    		"#525252"
    	],
    	activePalette: ["#ecfbe8", "#c5eebc", "#99de8e", "#6dce63", "#42be3c", "#1aad19", "#12981a", "#0c7f1c", "#06661c", "#024b19"],
    	customPalette: ["#f8fff6","#c8efbf","#98de8d","#6bce61","#41bd3a","#1aad19","#0f8f1b","#08701c","#03521a","#003314"],
    	activeMainColor: "#1AAD19",
    	customMainColor: "#1AAD19",
    	customMainColorInput: "1AAD19",
    	customPickerShow: false,
        customPaddingLeft: 0.0,
        customPaddingRight: 0,
        customGammaLeft: 1,
        customGammaRight: 1,
        customHLeft: 107,
        customHRight: 144,
    	datasets: [],
    	chart: null,
    	sequenceNavIndex: 0
    }

    randomScalingFactor = () => Math.round(Math.random() * 100)

    handlePaletteClick = (mainColor, colors) => {
    	this.setState({
    		activePalette: colors,
    		activeMainColor: mainColor
    	}, this.updateChart)
    }

    handleSliderChange = sliderValue => {
    	const { activeMainColor, customMainColor, chart } = this.state
		this.setState({
			sliderValue
		}, () => {
			this.setState({
				activePalette: this.generatePalette(activeMainColor),
				customPalette: this.generatePalette(customMainColor)
			}, () => {
				const { activePalette, customPalette, sequenceNavIndex } = this.state
				const datasets = []
                const palette = sequenceNavIndex === 0 ? activePalette : customPalette
				palette.forEach(color => {
					datasets.unshift({
			            backgroundColor: color,
			            hoverBackgroundColor: color,
			            data: [
			                this.randomScalingFactor(),
			                this.randomScalingFactor(),
			                this.randomScalingFactor(),
			                this.randomScalingFactor(),
			                this.randomScalingFactor(),
			                this.randomScalingFactor(),
			                this.randomScalingFactor(),
			                this.randomScalingFactor()
			            ]
			        })
				})
				chart.data.datasets = datasets
				chart.update()
				this.setState({ chart })
			})
		})
    }

    handleCustomPickerChange = customMainColor => {
    	const hex = customMainColor.hex
        const palette = this.generatePalette(hex)
    	this.setState({
    		customMainColor: hex,
    		customMainColorInput: hex.substring(1),
    		customPalette: palette,
            customHLeft: Math.round(chroma(palette[0]).hsv()[0]),
            customHRight: Math.round(chroma(palette[palette.length - 1]).hsv()[0])
    	}, this.updateChart)
    }

    handleCustomMainColorInputChange = e => {
    	const val = e.target.value
    	this.setState({
    		customMainColorInput: val
    	})

    	if (/(^[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val)) {
    		this.setState({
    			customMainColor: `#${val}`,
    			customPalette: this.generatePalette(`#${val}`)
    		}, this.updateChart)
    	}
    }

    updateChart = () => {
    	const datasets = []
    	const { activePalette, customPalette, sequenceNavIndex, chart, sliderValue } = this.state
    	const pltt = sequenceNavIndex === 0 ? activePalette : customPalette 
    	pltt.forEach((color, i) => {
    		chart.data.datasets[sliderValue - i - 1].backgroundColor = color
    		chart.data.datasets[sliderValue - i - 1].hoverBackgroundColor = color
    	})
    	this.setState({ chart })
    	chart.update()
    }

    handleSliderCustomPaddingLeftChange = customPaddingLeft => {
        this.setState({ customPaddingLeft }, () => {
            this.setState({
                customPalette: this.generatePalette(this.state.customMainColor)
            }, this.updateChart)
        })
    }

    handleSliderCustomPaddingRightChange = customPaddingRight => {
        this.setState({ customPaddingRight }, () => {
            this.setState({
                customPalette: this.generatePalette(this.state.customMainColor)
            }, this.updateChart)
        })
    }

    handleSliderCustomGammaLeftChange = customGammaLeft => {
        this.setState({ customGammaLeft }, () => {
            this.setState({
                customPalette: this.generatePalette(this.state.customMainColor)
            }, this.updateChart)
        })
    }

    handleSliderCustomGammaRightChange = customGammaRight => {
        this.setState({ customGammaRight }, () => {
            this.setState({
                customPalette: this.generatePalette(this.state.customMainColor)
            }, this.updateChart)
        })
    }

    handleSliderCustomHLeftChange = customHLeft => {
        this.setState({ customHLeft }, () => {
            this.setState({
                customPalette: this.generatePalette(this.state.customMainColor, {customH: true})
            }, this.updateChart)
        })
    }

    handleSliderCustomHRightChange = customHRight => {
        this.setState({ customHRight }, () => {
            this.setState({
                customPalette: this.generatePalette(this.state.customMainColor, {customH: true})
            }, this.updateChart)
        })
    }

    generatePalette = (mainColor, options) => {
    	const { sliderValue, sequenceNavIndex, customPaddingLeft, customPaddingRight, customGammaLeft, customGammaRight } = this.state
    	let firstS = 0.04
    	let firstV = 1
    	let lastS = 1.2
    	let _paddingLeft
    	let _paddingRight
    	let gammaLeft = 1.1
    	let gammaRight = 1.1

    	if (sliderValue === 4 || sliderValue + 1 === 4) {
    	    _paddingLeft = 0.15
    	    _paddingRight = 0.7
    	}
    	else if (sliderValue === 6 || sliderValue + 1 === 6) {
    	    _paddingLeft = 0.1
    	    _paddingRight = 0.5
    	}
    	else if (sliderValue === 8 || sliderValue + 1 === 8) {
    	    _paddingLeft = 0.1
    	    _paddingRight = 0.3
    	}
    	else if (sliderValue === 10 || sliderValue + 1 === 10) {
    	    _paddingLeft = 0.05
    	    _paddingRight = 0.2
    	}
    	else if (sliderValue === 12 || sliderValue + 1 === 12) {
    	    _paddingLeft = 0.05
    	    _paddingRight = 0.05
    	}
    	else if (sliderValue === 14 || sliderValue + 1 === 14) {
    	    _paddingLeft = 0.05
    	    _paddingRight = 0
    	}
    	else if (sliderValue === 16 || sliderValue + 1 === 16) {
    	    _paddingLeft = 0.05
    	    _paddingRight = 0
    	}

    	const chromaColor = chroma(mainColor)
    	const mainH = chromaColor.get("hsv.h")
    	const mainS = chromaColor.get("hsv.s")
    	const mainV = chromaColor.get("hsv.v")
    	let _firstH = .97
    	let _lastH = 1.2
    	let _lastV = 0.2

    	if (mainH > 0 && mainH <= 30) {
    	    _firstH = 1.05
    	}
    	else if (mainH > 30 && mainH <= 60) {
    	    _lastH = 0.8
    	}
    	else if (mainH > 90 && mainH <= 160) {
    	    _firstH = 0.9
    	}
    	else if (mainH > 220 && mainH <= 270) {
    	    _firstH = 0.9
    	}
    	else if (mainH > 270 && mainH <= 360) {
    	    _firstH = 1.05
    	}

    	if (mainV <= .2) {
    	    _lastV = 0
    	}
    	else if (mainV <= .45) {
    	    _lastV = 0.1
    	}

    	const h = options && options.customH ? this.state.customHLeft : mainH * _firstH
    	const s = mainS * firstS
    	const v = firstV

    	const H = options && options.customH ? this.state.customHRight : mainH * _lastH
    	const S = mainS * 1.2 < 1 ? chromaColor.get("hsv.s") * lastS : 1
    	const V = _lastV

    	const firstColor = chroma.hsv([h, s, v]).hex()
    	const lastColor = chroma.hsv([H, S, V]).hex()

    	const leftNumber = sliderValue % 2 ? (sliderValue - 1) / 2 + 1 : (sliderValue / 2 + 1)
    	const rightNumber = sliderValue % 2 ? (sliderValue - 1) /2 + 1 : sliderValue / 2

    	const left = chroma
    	    .scale([firstColor, mainColor])
    	    .mode("hsv")
    	    .padding([sequenceNavIndex === 0 ? _paddingLeft : customPaddingLeft, 0])
    	    .gamma(sequenceNavIndex === 0 ? gammaLeft : customGammaLeft)
    	    .colors(leftNumber)

    	const right = chroma
    	    .scale([mainColor, lastColor])
    	    .mode("hsv")
    	    .padding([0, sequenceNavIndex === 0 ? _paddingRight : customPaddingRight])
            .gamma(sequenceNavIndex === 0 ? gammaRight : customGammaRight)
    	    .colors(rightNumber)

    	right.shift()
    	return left.concat(right)
    }

    handleBodyClick = e => {
    	const { sequenceNavIndex } = this.state
    	if (sequenceNavIndex === 2) {
    		this.setState({
    			customPickerShow: this.customPicker.contains(e.target)
    		})
    	}
    }

    componentDidMount = () => {
    	window.addEventListener("click", this.handleBodyClick)
    	const canvas = this.canvas
    	Chart.defaults.global.defaultFontColor = "rgba(154, 154, 154, .7)"
    	setTimeout(() => {
	    	if (canvas) {
				const datasets = []
				this.state.activePalette.forEach(color => {
					datasets.unshift({
			            backgroundColor: color,
			            hoverBackgroundColor: color,
			            data: [
			                this.randomScalingFactor(),
			                this.randomScalingFactor(),
			                this.randomScalingFactor(),
			                this.randomScalingFactor(),
			                this.randomScalingFactor(),
			                this.randomScalingFactor(),
			                this.randomScalingFactor(),
			                this.randomScalingFactor()
			            ]
			        })
				})
	    		const ctx = canvas.getContext('2d')
	    		const chart = new Chart(ctx, {
	    		    type: 'bar',
	    		    data: {
			    	    labels: ["12-1", "12-2", "12-3", "12-4", "12-5", "12-6", "12-7", "12-8"],
			    	    datasets
			    	},
	    		    options: {
	    		    	legend: {
	    		    		display: false
	    		    	},
	    		    	tooltips: {
	    		    		enabled: false
	    		    	},
	    		    	animation: {
	    		    		duration: 400
	    		    	},
	    		    	scales: {
	    		    	    xAxes: [{
	    		    	        stacked: true,
	    		    	        barThickness: 24,
	    		    	        gridLines: {
	    		    	        	color: "rgba(0, 0, 0, 0)",
	    		    	        	drawBorder: false
	    		    	        }
	    		    	    }],
	    		    	    yAxes: [{
	    		    	        stacked: true,
	    		    	        gridLines: {
	    		    	        	color: "rgba(228, 232, 235, .1)",
	    		    	        	drawBorder: false
	    		    	        }
	    		    	    }]
	    		    	}
	    		    }
	    		})

	    		this.setState({ chart })
	    	}
    	}, 500)
    }

    componentWillUnmount = () => {
    	window.removeEventListener("click", this.handleBodyClick)
    }

    render() {
    	const {
    		sliderValue,
    		palettes,
    		activePalette,
    		activeMainColor,
    		datasets,
    		chart,
    		sequenceNavIndex,
    		customPalette,
    		customMainColor,
    		customMainColorInput,
    		customPickerShow,
            customPaddingLeft,
            customPaddingRight,
            customGammaLeft,
            customGammaRight,
            customHLeft,
            customHRight
    	} = this.state

        return <div className={styles.wrapper}>
        	<header className={styles.header}>
        		<div className={styles.commonWrapper}>
        			<div className={styles.title}>
        				<h1>ColorPod</h1><span>for visualization</span>
        			</div>
        			<p>
        				ColorPod 是一个基于 <span>Chroma.js</span> 的可视化色彩生成工具，服务于数据可视化色彩的基础运用。<br />
        				ColorPod 具有灵活、通用的特性：把工具导入图表，即可配置图表颜色。尝试为数据可视化提供有效的基础色彩方案，为数据浏览创造更好的体验。
        			</p>
        		</div>
        	</header>
        	<main className={classNames(styles.main, styles.commonWrapper)}>
        		<div className={styles.color}>
        			<section className={styles.picker}>
        				<ol className={styles.tab}>
        					<li className={styles.active}>序列</li>
        					<li>发散</li>
        					<li>定性</li>
        				</ol>
        				<div>
        					<div className={styles.sequenceNumberWrapper}>
        						<span>数据组数</span>
        						<Slider
        							style={{flex: 1, marginLeft: "12px", marginRight: "12px"}}
        							min={3}
        							max={16}
        							onChange={sliderValue => this.handleSliderChange(sliderValue)}
        							value={sliderValue}
        						/>
        						<input
        							type="text"
        							value={sliderValue}
        							onChange={e => {
        								const value = Number(e.target.value)
        								this.setState({ sliderValue: value })
        							}}
        						/>
        					</div>
        					<div className={styles.sequenceContent}>
        						<ol className={styles.sequenceNav}>
        							{
        								["同色相", "异色相", "自定义"].map((o, i) => <li
        									key={o}
        									className={sequenceNavIndex === i ? styles.active : ""}
        									onClick={() => this.setState({ sequenceNavIndex: i }, this.updateChart)}
    									>
    										{o}
    									</li>)
        							}
        						</ol>
        						{
        							sequenceNavIndex === 0 && <ol className={styles.palettes}>
	        							{
	        								palettes.map((mainColor, i) => {
	        									const colors = this.generatePalette(mainColor)

	        									return <li
	        										key={mainColor}
	        										onClick={() => this.handlePaletteClick(mainColor, colors)}
	        										className={mainColor === activeMainColor ? styles.active : ''}
	    										>
	        										{
	        											colors.map((color, i) => {
	        												const content = color.substring(1)
	        												return <i
		        												key={i}
		        												style={{backgroundColor: color}}
		    												>
		    													<ColorTooltip
		    														content={content}
	    														/>
		    												</i>
	        											})
	        										}
	        									</li>
	        								})
	        							}
	        						</ol>
        						}
        						{
        							sequenceNavIndex === 2 && <div className={styles.custom}>
        								<ol className={styles.customPalette}>
        									{
        										customPalette.map((color, i) => {
        											const content = color.substring(1)
        											return <li
		    											key={i}
		    											style={{backgroundColor: color}}
													>
														<ColorTooltip
			    											content={content}
		    											/>
													</li>
        										})
        									}
        								</ol>
        								<div
        									ref={customPicker => this.customPicker = customPicker}
        									className={classNames(styles.customPickerWrapper, {
        										[styles.pickerShow]: customPickerShow,
        										[styles.dark]: chroma(customMainColor).luminance() > 0.4
        									})}
        									onClick={e => e.stopPropagation()}
    									>
        									<div
        										className={styles.customPicker}
        										style={{
        											backgroundColor: customMainColor
        										}}
        										onClick={() => this.setState({ customPickerShow: !this.state.customPickerShow })}
    										>
        										<svg viewBox="0 0 16 16">
        										    <path d="M8.003 11l.008.007 4.597-4.596-1.06-1.06-3.544 3.543L4.46 5.35 3.4 6.41l4.596 4.597.007-.007z" />
        										</svg>
        									</div>
        									<div className={styles.customInput}>
        										<input
        											type="text"
        											value={customMainColorInput}
        											onChange={this.handleCustomMainColorInputChange}
        										/>
        									</div>

        									<PhotoshopPicker
        										className={styles.photoShopPicker}
        									    color={customMainColor}
        									    onChange={this.handleCustomPickerChange}
        									    onAccept={() => this.setState({ customPickerShow: false })}
        									    onCancel={() => this.setState({ customPickerShow: false })}
        									/>
        								</div>
        								<div className={styles.customValueWrapper}>
        									<div className={styles.customValue}>
        										<div className={styles.customValueTitle}>亮侧</div>
        										<div>
                                                    <div className={styles.customValueContent}>
                                                        <span>强度</span>
                                                        <Slider
                                                            className={styles.customValueSlider}
                                                            min={-0.5}
                                                            max={0.5}
                                                            step={0.01}
                                                            onChange={customPaddingLeft => this.handleSliderCustomPaddingLeftChange(customPaddingLeft)}
                                                            value={customPaddingLeft}
                                                        />
                                                        <span>{ customPaddingLeft }</span>
                                                    </div>
                                                    <div className={styles.customValueContent}>
                                                        <span>中心</span>
                                                        <Slider
                                                            className={styles.customValueSlider}
                                                            min={0}
                                                            max={4}
                                                            step={0.01}
                                                            onChange={customGammaLeft => this.handleSliderCustomGammaLeftChange(customGammaLeft)}
                                                            value={customGammaLeft}
                                                        />
                                                        <span>{ customGammaLeft }</span>
                                                    </div>
                                                    <div className={styles.customValueContent}>
                                                        <span>色相</span>
                                                        <Slider
                                                            className={styles.customValueSlider}
                                                            min={0}
                                                            max={360}
                                                            onChange={customHLeft => this.handleSliderCustomHLeftChange(customHLeft)}
                                                            value={customHLeft}
                                                        />
                                                        <span>{ customHLeft }</span>
                                                    </div>
                                                </div>
        									</div>
        								</div>
                                        <div className={styles.customValueWrapper}>
                                            <div className={styles.customValue}>
                                                <div className={styles.customValueTitle}>暗侧</div>
                                                <div>
                                                    <div className={styles.customValueContent}>
                                                        <span>强度</span>
                                                        <Slider
                                                            className={styles.customValueSlider}
                                                            min={-0.5}
                                                            max={0.5}
                                                            step={0.01}
                                                            onChange={customPaddingRight => this.handleSliderCustomPaddingRightChange(customPaddingRight)}
                                                            value={customPaddingRight}
                                                        />
                                                        <span>{ customPaddingRight }</span>
                                                    </div>
                                                    <div className={styles.customValueContent}>
                                                        <span>中心</span>
                                                        <Slider
                                                            className={styles.customValueSlider}
                                                            min={0}
                                                            max={4}
                                                            step={0.01}
                                                            onChange={customGammaRight => this.handleSliderCustomGammaRightChange(customGammaRight)}
                                                            value={customGammaRight}
                                                        />
                                                        <span>{ customGammaRight }</span>
                                                    </div>
                                                    <div className={styles.customValueContent}>
                                                        <span>色相</span>
                                                        <Slider
                                                            className={styles.customValueSlider}
                                                            min={0}
                                                            max={360}
                                                            onChange={customHRight => this.handleSliderCustomHRightChange(customHRight)}
                                                            value={customHRight}
                                                        />
                                                        <span>{ customHRight }</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
        							</div>
        						}
        					</div>
        				</div>
        			</section>
        			<section className={styles.chartWrapper}>
        				<div className={styles.chart}>
        					<canvas
        						width="530"
        						height="270"
        						ref={canvas => this.canvas = canvas}
    						></canvas>
        				</div>
        			</section>
        		</div>
        		<div className={styles.article} style={{
        			opacity: "0.80",
        			fontSize: "24px",
        			lineHeight: "33px",
        			color: "#ffffff"
        		}}>
        			使用指南
        		</div>
        	</main>
        </div>
    }
}

export default App
