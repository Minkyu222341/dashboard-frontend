import React, { useEffect, useRef, useMemo } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { SiteStatus } from '@/services/dashboardService';

//배포체크

// Chart.js 등록
ChartJS.register(...registerables);

interface StatusChartProps {
  sites: SiteStatus[];
  isLoading?: boolean;
}

const StatusChart = React.memo(function StatusChart({
  sites,
  isLoading = false,
}: StatusChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  // 정렬된 사이트 데이터 - 메모이제이션 적용
  const sortedSites = useMemo(
    () => [...sites].sort((a, b) => a.sequence - b.sequence),
    [sites],
  );

  // 차트 레이블과 데이터 - 메모이제이션 적용
  const chartData = useMemo(
    () => ({
      labels: sortedSites.map(site => site.siteName),
      datasets: [
        {
          label: '완료',
          data: sortedSites.map(site => site.completedRequests),
          backgroundColor: '#6EE7B7', // 노란색
        },
        {
          label: '전체',
          data: sortedSites.map(site => site.totalRequests),
          backgroundColor: '#60A5FA', // 파란색
        },
      ],
    }),
    [sortedSites],
  );

  useEffect(() => {
    // 차트 인스턴스가 이미 존재하면 파괴
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // canvas 요소가 존재하는지 확인
    const canvas = chartRef.current;
    if (!canvas) return;

    // 데이터 최대값 계산
    const maxValue = Math.max(
      ...chartData.datasets.flatMap(dataset => dataset.data as number[]),
    );

    // 새 차트 인스턴스 생성
    chartInstance.current = new ChartJS(canvas, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '사이트별 요청 현황',
            font: {
              size: 16,
            },
          },
          tooltip: {
            callbacks: {
              title: function (tooltipItems) {
                // 툴팁에 전체 사이트 이름 표시
                return chartData.labels[tooltipItems[0].dataIndex];
              },
              label: function (tooltipItem) {
                // 툴팁에 정수값만 표시 (천 단위 구분자 추가)
                const datasetLabel = tooltipItem.dataset.label || '';
                const value = Math.round(tooltipItem.parsed.y);
                return `${datasetLabel}: ${value.toLocaleString()}`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 0, // 수평 텍스트
              minRotation: 0,
              font: {
                size: 11,
              },
              // 긴 레이블을 적절히 줄임
              callback: function (val, index) {
                const label = this.getLabelForValue(index);
                const maxLength = 15;
                return label.length > maxLength
                  ? label.substring(0, maxLength - 3) + '...'
                  : label;
              },
            },
            grid: {
              display: true,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              // 깔끔한 눈금 표시를 위한 콜백 함수 - 천 단위 구분자 추가
              callback: function (value) {
                const numValue = Number(value);

                // 유효한 숫자가 아니면 표시하지 않음
                if (isNaN(numValue)) return null;

                // 눈금 간격 기준 확인 (표시할 값인지)
                let shouldDisplay = false;

                // 0은 항상 표시
                if (numValue === 0) shouldDisplay = true;
                // 데이터 범위에 따라 적절한 간격으로 눈금 표시
                else if (maxValue > 500) {
                  shouldDisplay = numValue % 100 === 0;
                } else if (maxValue > 200) {
                  shouldDisplay = numValue % 50 === 0;
                } else if (maxValue > 100) {
                  shouldDisplay = numValue % 20 === 0;
                } else if (maxValue > 50) {
                  shouldDisplay = numValue % 10 === 0;
                } else if (maxValue > 20) {
                  shouldDisplay = numValue % 5 === 0;
                } else {
                  shouldDisplay = Number.isInteger(numValue);
                }

                // 표시할 값이면 천 단위 구분자 추가하여 반환
                return shouldDisplay ? numValue.toLocaleString() : null;
              },
              precision: 0, // 소수점 표시 안함
            },
            // 격자 설정
            grid: {
              color: 'rgba(0, 0, 0, 0.1)', // 더 밝은 그리드 라인
            },
          },
        },
      },
    });

    return () => {
      // 컴포넌트 언마운트 시 차트 인스턴스 파괴
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="mt-8 bg-white shadow rounded-lg p-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="overflow-x-auto">
        {/* 차트의 너비를 사이트 수에 따라 동적으로 계산 */}
        <div
          className="h-80"
          style={{
            minWidth: '100%',
            width: `${Math.max(100, sites.length * 100)}px`,
          }}
        >
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
});

export default StatusChart;
