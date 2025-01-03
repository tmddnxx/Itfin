

TE3000 = class TE3000 extends AView
{
	constructor()
	{
		super()

		//TODO:edit here

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		//TODO:edit here

	}

	onInitDone()
	{
		super.onInitDone()

		//TODO:edit here

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)
        const keys = ['time', 'open', 'high', 'low', 'close', 'volume'];

        const data = [
            { time: "05/17/2021", open: 100, high: 110, low: 90, close: 95, volume: 1000 },
            { time: "05/17/2021", open: 105, high: 115, low: 95, close: 110, volume: 1500 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 110, volume: 1200 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 115, volume: 1200 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 115, volume: 1200 },
            { time: "05/17/2021", open: 100, high: 110, low: 90, close: 95, volume: 1000 },
            { time: "05/17/2021", open: 105, high: 115, low: 95, close: 110, volume: 1500 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 110, volume: 1200 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 115, volume: 1200 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 115, volume: 1200 },
            { time: "05/17/2021", open: 100, high: 110, low: 90, close: 95, volume: 1000 },
            { time: "05/17/2021", open: 105, high: 115, low: 95, close: 110, volume: 1500 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 110, volume: 1200 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 115, volume: 1200 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 115, volume: 1200 },
            { time: "05/17/2021", open: 100, high: 110, low: 90, close: 95, volume: 1000 },
            { time: "05/17/2021", open: 105, high: 115, low: 95, close: 110, volume: 1500 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 110, volume: 1200 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 115, volume: 1200 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 115, volume: 1200 },
            { time: "05/17/2021", open: 100, high: 110, low: 90, close: 95, volume: 1000 },
            { time: "05/17/2021", open: 105, high: 115, low: 95, close: 110, volume: 1500 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 110, volume: 1200 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 115, volume: 1200 },
            { time: "05/17/2021", open: 110, high: 120, low: 100, close: 115, volume: 1200 },
            
        ];
		
        const candleChart = this.candleChart;
        candleChart.setData(data,keys);
        console.log(candleChart);
	}

}

