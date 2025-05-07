import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { SiteStatus } from '@/services/dashboardService';

// Chart.js 등록 - 컴포넌트 외부에서 등록
ChartJS.register(...registerables);

interface StatusChartProps {
  sites: SiteStatus[];
}

const StatusChart: React.FC<StatusChartProps> = ({ sites }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    // 차트 인스턴스가 이미 존재하면 파괴
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // canvas 요소가 존재하는지 확인
    const canvas = chartRef.current;
    if (!canvas) return;

    // 차트 데이터 준비
    const labels = sites.map(site => site.siteName);

    // 새 차트 인스턴스 생성
    chartInstance.current = new ChartJS(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: '완료 요청',
            data: sites.map(site => site.completedRequests),
            backgroundColor: '#4ade80', // 초록색
          },
          {
            label: '요청 개수',
            data: sites.map(site => site.totalRequests),
            backgroundColor: '#60a5fa', // 파란색
          },
        ],
      },
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
                return labels[tooltipItems[0].dataIndex];
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
  }, [sites]);

  return (
    <div className="mt-8 bg-white shadow rounded-lg p-6">
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
};

export default StatusChart;
