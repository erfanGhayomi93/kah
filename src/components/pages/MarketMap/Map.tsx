import { useMarketMapQuery } from '@/api/queries/marketQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { useBrokerQueryClient, useDebounce } from '@/hooks';
import { isBetween, numFormatter, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
type Node = MarketMap.Root | MarketMap.Sector | MarketMap.Symbol;
type SectorNode = d3.HierarchyRectangularNode<MarketMap.Sector>;
type SymbolNode = d3.HierarchyRectangularNode<Node>;

interface MapPropsType {
	filters: TMarketMapFilters;
	setFilters: React.Dispatch<React.SetStateAction<TMarketMapFilters>>;
}

const PADDING = { top: 24, left: 1, bottom: 4, right: 1, inner: 4 };

const Map = ({ filters, setFilters }: MapPropsType) => {
	const queryClient = useBrokerQueryClient();

	const mouseDebounceTimer = useRef<NodeJS.Timeout | null>(null);

	const { setDebounce } = useDebounce();

	const hierarchy = useRef<null | SymbolNode>(null);

	const pan = useRef<null | d3.ZoomBehavior<Element, unknown>>(null);

	const treemap = useRef<null | d3.TreemapLayout<Node>>(null);

	const group = useRef<null | d3.Selection<SVGGElement, unknown, null, undefined>>(null);

	const tooltip = useRef<null | d3.Selection<HTMLDivElement, unknown, null, undefined>>(null);

	const xScale = useRef<null | d3.ScaleLinear<number, number, never>>(null);

	const yScale = useRef<null | d3.ScaleLinear<number, number, never>>(null);

	const wrapperRef = useRef<HTMLDivElement | null>(null);

	const tooltipRef = useRef<HTMLDivElement | null>(null);

	const heatmapRef = useRef<SVGSVGElement | null>(null);

	const {
		data: marketMapData,
		isError,
		isFetched,
		isFetching,
		refetch,
	} = useMarketMapQuery({
		queryKey: ['marketMapQuery'],
	});

	const x = (value: number): number => {
		try {
			if (!xScale.current) {
				const wrapperElement = wrapperRef.current!;
				const offset = wrapperElement.getBoundingClientRect();

				xScale.current = d3.scaleLinear().rangeRound([0, offset.width]).domain([0, offset.width]);
			}

			return xScale.current(value);
		} catch (e) {
			return value;
		}
	};

	const y = (value: number): number => {
		try {
			if (!yScale.current) {
				const wrapperElement = wrapperRef.current!;

				const offset = wrapperElement.getBoundingClientRect();
				const height = offset.height + PADDING.top + PADDING.bottom;

				yScale.current = d3.scaleLinear().rangeRound([0, height]).domain([0, height]);
			}

			return yScale.current(value);
		} catch (e) {
			return value;
		}
	};

	const getFontSize = (width: number, height: number) => {
		const scaleFactor = 0.15; // Adjust this value to suit your needs

		const fontSize = Math.min(width, height) * scaleFactor;

		return `${Math.round(fontSize)}px`;
	};

	const color = (percentage: number) => {
		if (percentage === 0) return 'rgb(53, 75, 97)';

		if (percentage < 0) {
			if (isBetween(-1, percentage, 0)) return 'rgb(137, 68, 80)';
			if (isBetween(-2, percentage, -1)) return 'rgb(173, 67, 74)';

			return 'rgb(221, 62, 63)';
		}

		if (isBetween(0, percentage, 1)) return 'rgb(33, 110, 111)';
		if (isBetween(1, percentage, 2)) return 'rgb(17, 137, 122)';

		return 'rgb(2, 163, 132)';
	};

	const opacity = () => {
		return '1';
	};

	const onMouseOverOnStock = (e: MouseEvent) => {
		const tooltipEl = tooltip.current?.node();
		if (!tooltipEl) return;

		const { width, height } = tooltipEl.getBoundingClientRect();
		const padding = 8;
		let left = e.clientX + padding;
		let top = e.clientY + padding;

		const realWidth = width + left;
		const realHeight = height + top;

		if (top < 0) top = 0;
		else if (realHeight > window.innerHeight) top -= height + padding;

		if (left < 0) left = 0;
		else if (realWidth > window.innerWidth - 72) left -= width + padding;

		tooltip.current?.style('top', `${top}px`);
		tooltip.current?.style('left', `${left}px`);
	};

	const dispatchBuySellModal = ({ depth, data }: SectorNode | SymbolNode) => {
		if (depth < 2) return;
	};

	const onEnter = (d: d3.Selection<d3.EnterElement, SymbolNode, SVGGElement, unknown>) => {
		d.append('g')
			.attr('class', (node) =>
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				node.depth === 1 ? `group sector i_${Number(node.data?.sc)}` : `group stock i_${Number(node.data.sc)}`,
			)
			.attr('transform', (node) => `translate(${Math.round(x(node.x0))},${Math.round(y(node.y0))})`)
			.style('color', 'rgb(44,45,53)')
			.on('click', (e, node) => {
				e.preventDefault();
				e.stopPropagation();

				if (mouseDebounceTimer.current) {
					dispatchBuySellModal(node);

					clearTimeout(mouseDebounceTimer.current);
					mouseDebounceTimer.current = null;
				} else {
					mouseDebounceTimer.current = setTimeout(() => {
						setSector(node);
						if (mouseDebounceTimer.current) {
							clearTimeout(mouseDebounceTimer.current);
							mouseDebounceTimer.current = null;
						}
					}, 200);
				}
			});

		return d;
	};

	const onUpdate = (d: d3.Selection<d3.BaseType, SymbolNode, SVGGElement, unknown>) => {
		d.style('color', 'rgb(44,45,53)')
			.attr('class', (node) =>
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				node.depth === 1 ? `group sector i_${Number(node.data.sc)}` : `group stock i_${Number(node.data.sc)}`,
			)
			.attr('transform', (node) => `translate(${Math.round(x(node.x0))},${Math.round(y(node.y0))})`);

		return d;
	};

	const onExit = (d: d3.Selection<d3.BaseType, SymbolNode, SVGGElement, unknown>) => {
		d.remove();
	};

	const onAfterDraw = () => {
		const eGroup = group.current;
		if (!eGroup) return;

		const blocks = eGroup.selectAll('g') as d3.Selection<d3.BaseType, SymbolNode, SVGGElement, unknown>;

		eGroup.selectAll('g').html('');

		eGroup
			.selectAll('g.group.sector')
			.on('mouseover', (e) => {
				const target = (e.target || e.currentTarget).closest('g.group.sector');
				if (target) target.style.color = 'rgb(10,71,132)';
			})
			.on('mouseleave', (e) => {
				const target = (e.target || e.currentTarget).closest('g.group.sector');
				if (target) target.style.color = 'rgb(44,45,53)';
			});

		eGroup
			.selectAll('g.sector')
			.append('rect')
			.attr('fill', 'currentColor')
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			.attr('width', (node) => Math.max(x(node.x1) - x(node.x0), 0))
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			.attr('height', (node) => Math.max(y(node.y1) - y(node.y0) - PADDING.bottom, 0))
			.attr('rx', '4');

		blocks
			.append('foreignObject')
			.attr('class', (node) => (node.depth === 1 ? 'rect sector-inner' : 'rect stock-inner'))
			.attr('width', (node) => x(node.x1) - x(node.x0))
			.attr('height', (node) => (node.depth === 1 ? 20 : Math.max(y(node.y1) - y(node.y0), 0)))
			.append('xhtml:span')
			.append('div')
			.classed('root', true)
			.style('cursor', 'pointer')
			.style('direction', 'ltr')
			.style('height', '100%');

		eGroup
			.selectAll('g.sector')
			.select('div.root')
			.style('background-color', 'currentColor')
			.style('overflow', 'hidden')
			.style('cursor', 'pointer')
			.style('display', 'flex')
			.style('justify-content', 'center')
			.style('align-items', 'center')
			.style('border-radius', '4px')
			.style('direction', 'rtl')
			.style('height', '100%')
			.append('span')
			.style('color', 'rgb(255,255,255)')
			.style('pointer-events', 'none')
			.style('padding', '0 4px')
			.style('overflow', 'hidden')
			.style('text-overflow', 'ellipsis ')
			.style('white-space', 'nowrap ')
			.style('font-size', '11px')
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			.text(({ data }) => {
				if ('sn' in data) return data.sn;
				if ('st' in data) return data.st;
				return data.title;
			});

		const stockInfo = eGroup
			.selectAll('g.stock')
			.select('div.root')
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			.style('background-color', (node) => color(node.data.lpp))
			.style('color', 'rgb(255,255,255)')
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			.style('opacity', (node) => opacity(node.data.cpp))
			.style('overflow', 'hidden')
			.style('cursor', 'pointer')
			.style('display', 'flex')
			.style('flex-direction', 'column')
			.style('color', 'rgb(255, 255, 255)')
			.style('justify-content', 'center')
			.style('align-items', 'center')
			.style('font-size', (node) =>
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				getFontSize(Math.max(x(node.x1) - x(node.x0), 0), Math.max(y(node.y1) - y(node.y0), 0)),
			)
			// ! Background & Tooltip
			.on('mouseover', (_, node) => {
				const { data } = node as SymbolNode;
				if (tooltip.current) tooltip.current.style('visibility', 'visible');
				if (tooltip.current) tooltip.current.style('background', 'rgb(44, 45, 53)');
				if (tooltip.current) tooltip.current.style('padding', '0.8rem 1.6rem');
				if (tooltip.current) tooltip.current.style('border-radius', '0.8rem');

				if (!('st' in data)) return;

				eGroup.selectAll(`g.group.sector.i_${data.sc}`).style('color', 'rgb(10,71,132)');

				const closingPricePercent = Number(data.cpp || 0);
				const lastTradedPricePercent = Number(data.lpp || 0);

				const title = `<div class="border-b border-b-light-gray-200 text-right text-base pb-8"><span>${data.st}</span></div>`;
				const lastTradedPrice = `<div class="text-sm flex justify-between gap-16"><div class="flex gap-8"><span>${sepNumbers(String(data.l | 0))}</span><span class="text-left ${lastTradedPricePercent < 0 ? 'text-light-error-100' : 'text-light-success-200'}">${lastTradedPricePercent < 0 ? `(${Math.abs(lastTradedPricePercent).toFixed(2)}%)` : `${lastTradedPricePercent.toFixed(2)}%`}</span></div><span class="text-right">آخرین قیمت</span></div>`;
				const closingPrice = `<div class="text-sm flex justify-between gap-16"><div class="flex gap-8"><span>${sepNumbers(String(data.c | 0))}</span><span class="text-left ${closingPricePercent < 0 ? 'text-light-error-100' : 'text-light-success-200'}">${closingPricePercent < 0 ? `(${Math.abs(closingPricePercent).toFixed(2)}%)` : `${closingPricePercent.toFixed(2)}%`}</span></div><span class="text-right">قیمت پایانی</span></div>`;
				const volume = `<div class="text-sm flex justify-between gap-16"><span class="text-left">${numFormatter(data.sibv + data.slbv || 0)}</span><span class="text-right">حجم معاملات</span></div>`;
				const value = `<div class="text-sm flex justify-between gap-16"><span class="text-left">${numFormatter(data.t || 0)}</span><span class="text-right">ارزش معاملات</span></div>`;

				tooltip.current?.html(
					`<div dir="ltr" class="flex flex-col text-white gap-8">${title}${lastTradedPrice}${closingPrice}${volume}${value}</div>`,
				);
			})
			.on('mousemove', (e) => onMouseOverOnStock(e as MouseEvent))
			.on('mouseleave', (_, node) => {
				const { data } = node as SymbolNode;
				if (!('st' in data)) return;

				eGroup.selectAll(`g.group.sector.i_${data.sc}`).style('color', 'rgb(44,45,53)');

				if (tooltip.current) tooltip.current.style('visibility', 'hidden');
			});

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		stockInfo.append('xhtml:span').text(({ data }) => data.st);

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		stockInfo.append('xhtml:span').text(({ data }) => `${Number(data.lpp || 0).toFixed(2)}%`);
	};

	const isExistsInUserSymbols = (watchlistId: number, symbolISIN: string) => {
		try {
			const cache = (queryClient.getQueryData(['allSymbolsQuery']) || []) as LimitSymbol[];
			return cache.some((symbol) => symbol.symbolISIN === symbolISIN && symbol.watchlistId === watchlistId);
		} catch (e) {
			return [];
		}
	};

	const isExistsInUserWatchlist = (symbolISIN: string) => {
		try {
			const cache = (queryClient.getQueryData(['allSymbolsQuery']) || []) as LimitSymbol[];
			return cache.some((symbol) => symbol.symbolISIN === symbolISIN && symbol.watchlistId > 0);
		} catch (e) {
			return [];
		}
	};

	const draw = (data: MarketMap.Root) => {
		try {
			const wrapperElement = wrapperRef.current;
			const heatmapElement = heatmapRef.current;
			const tooltipElement = tooltipRef.current;
			if (!wrapperElement || !heatmapElement || !tooltipElement) return;

			const offset = wrapperElement.getBoundingClientRect();
			const width = offset.width;
			const height = offset.height + PADDING.top + PADDING.bottom;

			// Tooltip
			tooltip.current = d3.select(tooltipElement);

			// Initialize the svg (chart) and legend
			if (!group.current) {
				const svg = d3.select(heatmapElement).attr('width', '100%').attr('height', '100%');

				// Pan & Zoom by wheel
				pan.current = d3
					.zoom()
					.scaleExtent([1, 8])
					.on('zoom', (e) => {
						if (['dblclick', 'click'].includes(e.sourceEvent.type)) return;
						group.current?.attr('transform', e.transform);
					});

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				svg.call(pan.current);

				group.current = svg.append('g').attr('transform', `translate(0,-${PADDING.top})`);
			}

			if (xScale.current) xScale.current.rangeRound([0, width]).domain([0, width]);
			if (yScale.current) yScale.current?.rangeRound([0, height]).domain([0, height]);

			// * Pan
			if (pan.current)
				pan.current.translateExtent([
					[0, PADDING.top],
					[width, height - PADDING.bottom],
				]);

			// Give the data to this cluster layout:
			hierarchy.current = d3
				.hierarchy(data as Node, (node) => ('s' in node ? node.s : []) as Iterable<Node>)
				.sum((node) => {
					if (!('sibv' in node)) return 0;

					if (filters.property.id === 'quantity') return Number(node.tt);

					if (filters.property.id === 'volume') return Number(node.sibv + node.slbv);

					return node.t;
				})
				.sort((node1, node2) => (node2?.value ?? 0) - (node1?.value ?? 0)) as SymbolNode;

			// Then d3.treemap computes the position of each element of the hierarchy
			treemap.current = d3.treemap<Node>().tile(d3.treemapBinary).round(true).size([width, height]);

			PADDING.top = 24;
			treemap.current
				.paddingTop(PADDING.top)
				.paddingLeft(PADDING.left)
				.paddingBottom(PADDING.bottom)
				.paddingRight(PADDING.right)
				.paddingInner(PADDING.inner);

			treemap.current(hierarchy.current);

			const children = hierarchy.current.descendants().filter((node) => node.depth > 0);

			try {
				group.current.selectAll('g').data(children).join(onEnter, onUpdate, onExit);
			} catch (e) {
				//
			}

			onAfterDraw();
		} catch (e) {
			//
		}
	};

	const scale = () => {
		try {
			PADDING.top = document.fullscreenElement ? 16 : 24;
			if (treemap.current) {
				treemap.current
					.paddingTop(PADDING.top)
					.paddingLeft(PADDING.left)
					.paddingBottom(PADDING.bottom)
					.paddingRight(PADDING.right)
					.paddingInner(PADDING.inner);
				treemap.current(hierarchy.current!);
			}

			tooltip.current?.style('visibility', 'hidden');

			const offset = wrapperRef.current!.getBoundingClientRect();
			const width = offset.width;
			const height = offset.height + PADDING.top + PADDING.bottom;

			// * Scale domain
			const d = hierarchy.current as SectorNode;

			xScale.current?.rangeRound([0, width]).domain([d.x0, d.x1]);
			yScale.current?.rangeRound([0, height]).domain([d.y0, d.y1]);

			// * Pan
			pan.current?.translateExtent([
				[0, 0],
				[width, height],
			]);

			// * Sectors
			const sectors = group.current
				?.selectAll('g.sector')
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				.attr('transform', (node) => `translate(${x(node.x0)},${y(node.y0)})`)
				.classed('transition-d', false);

			sectors
				?.select('rect')
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				.attr('width', (node) => Math.max(x(node.x1) - x(node.x0), 0))
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				.attr('height', (node) => Math.max(y(node.y1) - y(node.y0), 0));

			sectors
				?.select('.sector-inner')
				.classed('transition-d', true)
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				.attr('width', (node) => Math.max(x(node.x1) - x(node.x0) - 2, 0));

			// * Stocks
			group.current?.selectAll('g.stock');

			const stockInfo = group.current
				?.selectAll('g.stock')
				.classed('transition-d', true)
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				.attr('transform', (node) => `translate(${x(node.x0)},${y(node.y0)})`);

			stockInfo
				?.select('.stock-inner')
				.classed('transition-d', true)
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				.attr('width', (node) => Math.max(x(node.x1) - x(node.x0), 0))
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				.attr('height', (d) => Math.max(y(d.y1) - y(d.y0), 0));

			stockInfo?.select('.root')?.style('font-size', (d) =>
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				getFontSize(Math.max(x(d.x1) - x(d.x0), 0), Math.max(y(d.y1) - y(d.y0), 0)),
			);
		} catch (e) {
			//
		}
	};

	const setSector = (node: SectorNode | SymbolNode) => {
		try {
			const sectorList = (queryClient.getQueryData(['marketMapSectorsQuery']) || []) as MarketMap.SectorAPI[];

			const { data } = node;
			if (!('sc' in data)) return;

			const sectorCode = Number(String(data.sc).trim());
			const sector = sectorList.find((sector) => Number(sector.id) === sectorCode) || null;

			setFilters((values) => ({
				...values,
				sector: Number(values.sector?.id) === sectorCode ? null : sector,
			}));
		} catch (e) {
			//
		}
	};

	const applyFilters = (data: MarketMap.Root) => {
		const result: MarketMap.Sector[] = [];

		try {
			const { map, market, percentage, symbolType, sector, watchlist } = filters;

			for (let i = 0; i < data.s.length; i++) {
				const sectorData = data.s[i];

				const currentSectorCode = Number(sectorData.sc.trim());
				const selectedSectorCode = sector ? Number(sector.id.trim()) : -1;

				const fillableSector: MarketMap.Sector = {
					sc: sectorData.sc,
					sn: sectorData.sn,
					s: [],
				};

				if (sectorData.s.length > 0) {
					if (
						selectedSectorCode === -1 ||
						(selectedSectorCode > -1 && currentSectorCode === selectedSectorCode)
					) {
						for (let j = 0; j < sectorData.s.length; j++) {
							const symbol = sectorData.s[j];

							if (
								map.id === 'all' ||
								(map.id === 'portfolio' && isExistsInUserSymbols(0, symbol.si)) ||
								(map.id === 'watchlist' &&
									((!watchlist && isExistsInUserWatchlist(symbol.si)) ||
										(watchlist && isExistsInUserSymbols(watchlist.id, symbol.si))))
							) {
								if (
									(market.id === 'all' || symbol.marketUnit === market.id) &&
									(symbolType.id === 'all' || symbol.symbolType === symbolType.id)
								) {
									if (percentage) {
										const percentageAsNumber = Number(percentage);

										if (percentageAsNumber === 0 && symbol.cpp === 0) fillableSector.s.push(symbol);
										else if (percentageAsNumber > 0 && symbol.cpp >= percentageAsNumber)
											fillableSector.s.push(symbol);
										else if (percentageAsNumber < 0 && symbol.cpp <= percentageAsNumber)
											fillableSector.s.push(symbol);
									} else {
										fillableSector.s.push(symbol);
									}
								}
							}
						}
					}
				}

				if (fillableSector.s.length > 0) result.push(fillableSector);
			}

			data.s = data.s.filter(Boolean);
		} catch (e) {
			//
		}

		return {
			title: data.title,
			s: result,
		};
	};

	useEffect(() => {
		window.addEventListener('resize', () => {
			setDebounce(() => scale(), 250);
		});

		window.addEventListener('fullscreenchange', () => {
			setDebounce(() => scale(), 250);
		});

		setInterval(() => refetch(), 6e4);
	}, []);

	useEffect(() => {
		if (!marketMapData || !Array.isArray(marketMapData.s)) return;

		const instanceOfData = JSON.parse(JSON.stringify(marketMapData)) as MarketMap.Root;

		draw(applyFilters(instanceOfData));
	}, [marketMapData, JSON.stringify(filters)]);

	return (
		<div id='treemap' ref={wrapperRef} className='relative size-full overflow-hidden rounded'>
			{isFetching && (!marketMapData || marketMapData.s.length === 0) && (
				<div className='absolute size-full'>
					<div className='relative size-full'>
						<Loading />
					</div>
				</div>
			)}
			{(isError || (isFetched && (!marketMapData || marketMapData.s.length === 0))) && (
				<div className='absolute size-full'>
					<div className='relative size-full'>
						<NoData />
					</div>
				</div>
			)}

			<div
				className={clsx(
					'heatmap-tooltip fixed',
					(!marketMapData || marketMapData.s.length === 0) && 'opacity-0',
				)}
				ref={tooltipRef}
			/>

			<div
				className={clsx(
					'size-full overflow-hidden',
					(isError || (isFetched && (!marketMapData || marketMapData.s.length === 0))) && 'hidden',
				)}
			>
				<svg ref={heatmapRef} id='heatmap' />
			</div>
		</div>
	);
};

export default Map;
