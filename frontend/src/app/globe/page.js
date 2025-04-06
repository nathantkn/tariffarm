"use client";

import React, { useEffect } from "react";
import Script from "next/script";

export default function GlobePage() {
  useEffect(() => {
    // Ensure that the amCharts libraries are available globally.
    if (!window.am5) {
      console.error("amCharts libraries not found");
      return;
    }

    // Create root element
    const root = window.am5.Root.new("chartdiv");

    // Set themes
    root.setThemes([window.am5themes_Animated.new(root)]);

    // Create the map chart
    const chart = root.container.children.push(
      window.am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: window.am5map.geoOrthographic()
      })
    );

    chart.set("maxZoomLevel", 3);

    // Create main polygon series for countries using world geoJSON data
    const polygonSeries = chart.series.push(
      window.am5map.MapPolygonSeries.new(root, {
        geoJSON: window.am5geodata_worldLow
      })
    );

    // Add graticule lines
    const graticuleSeries = chart.series.push(
      window.am5map.GraticuleSeries.new(root, {})
    );
    graticuleSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get("alternativeBackground"),
      strokeOpacity: 0.08
    });

    // Create line series for trajectory lines (invisible base)
    const lineSeries = chart.series.push(
      window.am5map.MapLineSeries.new(root, {})
    );
    lineSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get("alternativeBackground"),
      strokeOpacity: 0
    });

    // Visible animated line series (now as dotted line)
    const animatedLineSeries = chart.series.push(
      window.am5map.MapLineSeries.new(root, {})
    );
    animatedLineSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get("alternativeBackground"),
      strokeOpacity: 0.6,
      strokeWidth: 2,
      strokeDasharray: [3, 3]  // This makes the line dotted.
    });

    // Destination series (cities)
    const citySeries = chart.series.push(
      window.am5map.MapPointSeries.new(root, {})
    );
    citySeries.bullets.push(() => {
      const circle = window.am5.Circle.new(root, {
        radius: 5,
        tooltipText: "{title}",
        tooltipY: 0,
        fill: window.am5.color(0xffba00),
        stroke: root.interfaceColors.get("background"),
        strokeWidth: 2
      });
      return window.am5.Bullet.new(root, { sprite: circle });
    });

    // City data
    const cities = [
        { id: "uk", title: "UK", geometry: { type: "Point", coordinates: [-0.1276, 51.5074] } },
        { id: "germany", title: "Germany", geometry: { type: "Point", coordinates: [13.405, 52.52] } },
        { id: "france", title: "France", geometry: { type: "Point", coordinates: [2.3522, 48.8566] } },
        { id: "india", title: "India", geometry: { type: "Point", coordinates: [77.1025, 28.7041] } },
        { id: "japan", title: "Japan", geometry: { type: "Point", coordinates: [139.6917, 35.6895] } },
        { id: "china", title: "China", geometry: { type: "Point", coordinates: [116.4074, 39.9042] } },
        { id: "canada", title: "Canada", geometry: { type: "Point", coordinates: [-75.6972, 45.4215] } },
        { id: "brazil", title: "Brazil", geometry: { type: "Point", coordinates: [-47.9292, -15.7801] } },
        { id: "australia", title: "Australia", geometry: { type: "Point", coordinates: [149.1300, -35.2809] } },
        { id: "mexico", title: "Mexico", geometry: { type: "Point", coordinates: [-99.1332, 19.4326] } },
        { id: "south-korea", title: "South Korea", geometry: { type: "Point", coordinates: [126.978, 37.5665] } },
        { id: "south-africa", title: "South Africa", geometry: { type: "Point", coordinates: [28.0473, -26.2041] } },
        { id: "colombia", title: "Colombia", geometry: { type: "Point", coordinates: [-74.0721, 4.711] } },
        { id: "chile", title: "Chile", geometry: { type: "Point", coordinates: [-70.6693, -33.4489] } },
        { id: "portugal", title: "Portugal", geometry: { type: "Point", coordinates: [-9.1393, 38.7223] } },
        { id: "spain", title: "Spain", geometry: { type: "Point", coordinates: [-3.7038, 40.4168] } },
        { id: "italy", title: "Italy", geometry: { type: "Point", coordinates: [12.4964, 41.9028] } },
        { id: "netherlands", title: "Netherlands", geometry: { type: "Point", coordinates: [4.9041, 52.3676] } },
        { id: "turkey", title: "Turkey", geometry: { type: "Point", coordinates: [32.8597, 39.9334] } },
        { id: "russia", title: "Russia", geometry: { type: "Point", coordinates: [37.6173, 55.7558] } },
        { id: "argentina", title: "Argentina", geometry: { type: "Point", coordinates: [-58.3816, -34.6037] } },
        { id: "indonesia", title: "Indonesia", geometry: { type: "Point", coordinates: [106.8456, -6.2088] } },
        { id: "thailand", title: "Thailand", geometry: { type: "Point", coordinates: [100.5018, 13.7563] } },
        { id: "vietnam", title: "Vietnam", geometry: { type: "Point", coordinates: [105.8544, 21.0285] } },
        { id: "philippines", title: "Philippines", geometry: { type: "Point", coordinates: [120.9842, 14.5995] } },
        { id: "bangladesh", title: "Bangladesh", geometry: { type: "Point", coordinates: [90.4125, 23.8103] } },
        { id: "pakistan", title: "Pakistan", geometry: { type: "Point", coordinates: [74.3587, 31.5204] } },
        { id: "malaysia", title: "Malaysia", geometry: { type: "Point", coordinates: [101.6869, 3.139] } },
        { id: "singapore", title: "Singapore", geometry: { type: "Point", coordinates: [103.8198, 1.3521] } },
        { id: "new-zealand", title: "New Zealand", geometry: { type: "Point", coordinates: [174.7762, -41.2865] } },
        { id: "uae", title: "UAE", geometry: { type: "Point", coordinates: [55.2708, 25.2048] } },
        { id: "saudi-arabia", title: "Saudi Arabia", geometry: { type: "Point", coordinates: [46.6753, 24.7136] } },
        { id: "israel", title: "Israel", geometry: { type: "Point", coordinates: [35.2137, 31.7683] } },
        { id: "egypt", title: "Egypt", geometry: { type: "Point", coordinates: [31.2357, 30.0444] } },
        { id: "morocco", title: "Morocco", geometry: { type: "Point", coordinates: [-6.8498, 33.9716] } },
        { id: "kenya", title: "Kenya", geometry: { type: "Point", coordinates: [36.8219, -1.2921] } },
        { id: "nigeria", title: "Nigeria", geometry: { type: "Point", coordinates: [3.3792, 6.5244] } },
        { id: "greece", title: "Greece", geometry: { type: "Point", coordinates: [23.7275, 37.9838] } },
        { id: "belgium", title: "Belgium", geometry: { type: "Point", coordinates: [4.3517, 50.8503] } },
        { id: "sweden", title: "Sweden", geometry: { type: "Point", coordinates: [18.0686, 59.3293] } },
        { id: "norway", title: "Norway", geometry: { type: "Point", coordinates: [10.7522, 59.9139] } },
        { id: "denmark", title: "Denmark", geometry: { type: "Point", coordinates: [12.5683, 55.6761] } },
        { id: "switzerland", title: "Switzerland", geometry: { type: "Point", coordinates: [7.4474, 46.9481] } },
        { id: "austria", title: "Austria", geometry: { type: "Point", coordinates: [16.3738, 48.2082] } },
        { id: "czech-republic", title: "Czech Republic", geometry: { type: "Point", coordinates: [14.4378, 50.0755] } },
        { id: "poland", title: "Poland", geometry: { type: "Point", coordinates: [21.0122, 52.2297] } },
        { id: "ukraine", title: "Ukraine", geometry: { type: "Point", coordinates: [30.5234, 50.4501] } },
        { id: "romania", title: "Romania", geometry: { type: "Point", coordinates: [26.1025, 44.4268] } },
        { id: "hungary", title: "Hungary", geometry: { type: "Point", coordinates: [19.0402, 47.4979] } },
        { id: "ireland", title: "Ireland", geometry: { type: "Point", coordinates: [-6.2603, 53.3498] } },
        { id: "finland", title: "Finland", geometry: { type: "Point", coordinates: [24.9384, 60.1695] } },
        { id: "peru", title: "Peru", geometry: { type: "Point", coordinates: [-77.0428, -12.0464] } },
        { id: "ecuador", title: "Ecuador", geometry: { type: "Point", coordinates: [-78.4678, -0.1807] } },
        { id: "panama", title: "Panama", geometry: { type: "Point", coordinates: [-79.5199, 8.9824] } },
        { id: "costa-rica", title: "Costa Rica", geometry: { type: "Point", coordinates: [-84.0739, 9.9281] } },
        { id: "usa", title: "USA", geometry: { type: "Point", coordinates: [-77.0369, 38.9072] } }
    ];

    citySeries.data.setAll(cities);

    // Prepare line series data: connect cities based on routes
    const routes = [
        "India → USA",
        "India → China → USA",
        "India → China → Japan → USA"
    ];

    routes.forEach((route) => {
        const stops = route
        .split("→")
        .map((s) => s.trim().toLowerCase().replaceAll(" ", "-"));

        let previousDataItem = null;

        stops.forEach((stop, index) => {
        const currentDataItem = citySeries.getDataItemById(stop);

        if (previousDataItem && currentDataItem) {
            // Create the visible line for the connection
            const connectionItem = lineSeries.pushDataItem({});
            connectionItem.set("pointsToConnect", [
              previousDataItem,
              currentDataItem
            ]);
  
            // Create the visible dotted line (static)
            const animatedLineDataItem = animatedLineSeries.pushDataItem({});
            animatedLineDataItem.set("pointsToConnect", [
              previousDataItem,
              currentDataItem
            ]);
  
            // Create the arrow that moves along the line
            const arrowSeries = chart.series.push(
              window.am5map.MapPointSeries.new(root, {
                layer: 100 // Set high layer value to ensure visibility above the globe
              })
            );
  
            // Calculate the rotation angle based on the line direction
            const fromCoords = previousDataItem.get("geometry").coordinates;
            const toCoords = currentDataItem.get("geometry").coordinates;
            const dx = toCoords[0] - fromCoords[0];
            const dy = toCoords[1] - fromCoords[1];
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            // Create a larger, more visible arrow
            arrowSeries.bullets.push(() => {
                const plane = window.am5.Picture.new(root, {
                    src: "/airplane_rotated.svg", // make sure plane.svg is in your public folder
                    width: 30,         // adjust size as needed
                    height: 30,
                    centerX: window.am5.p50,
                    centerY: window.am5.p50,
                    rotation: angle    // use the computed angle from your code
                });
                return window.am5.Bullet.new(root, { sprite: plane });
            });

            // Create multiple arrows for each line segment (creates a "train" effect)
            const numArrows = 1; // Number of arrows per line
            
            for (let i = 0; i < numArrows; i++) {
                const arrowDataItem = arrowSeries.pushDataItem({
                lineDataItem: animatedLineDataItem,
                positionOnLine: i / numArrows, // Start at different positions
                autoRotate: true
            });

              // Animate the arrow along the line
            const animation = arrowDataItem.animate({
                key: "positionOnLine",
                from: i / numArrows,
                to: 1,
                duration: 4000,
                loops: Infinity,
                easing: window.am5.ease.out(window.am5.ease.cubic),
            });
            
            }
        }
  
        previousDataItem = currentDataItem;
        });
      });
    
    // Zoom out more on initial load (changed zoom level from 3 to 1)
    polygonSeries.events.on("datavalidated", function () {
        chart.zoomToGeoPoint(
        {
            longitude: -0.1262,
            latitude: 51.5002
        },
        1
        );
    });

    // Animate chart appearance
    chart.appear(1000, 100);

    chart.animate({
        key: "rotationX",
        from: 0,
        to: 360 * 2, // 3 full rotations
        duration: 15000,
        easing: window.am5.ease.out(window.am5.ease.cubic)
    });

    // Cleanup function: dispose the chart when component unmounts.
    return () => {
        root.dispose();
    };
}, []);

return (
    <>
      {/* Load external amCharts scripts */}
      <Script src="https://cdn.amcharts.com/lib/5/index.js" strategy="beforeInteractive" />
      <Script src="https://cdn.amcharts.com/lib/5/map.js" strategy="beforeInteractive" />
      <Script src="https://cdn.amcharts.com/lib/5/geodata/worldLow.js" strategy="beforeInteractive" />
      <Script src="https://cdn.amcharts.com/lib/5/themes/Animated.js" strategy="beforeInteractive" />

      {/* Page Content */}
      <div style={{ padding: "20px" }}>
        {/* Top Page Heading */}
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Global Map Dashboard
        </h1>

        {/* Globe (Map) Window - increased height for a larger view */}
        <div id="chartdiv" style={{ width: "100%", height: "650px" }} />

        {/* Data Table below the globe window */}
        <table
          style={{
            margin: "20px auto",
            width: "80%",
            borderCollapse: "collapse",
            textAlign: "center"
          }}
          border="1"
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Itinerary</th>
              <th>Cost</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Spinach</td>
              <td>Paris - Brussels - Chicago</td>
              <td>$500</td>
              <td>2 days</td>
            </tr>
            <tr>
              <td>Broccoli</td>
              <td>London - Prague - Athens</td>
              <td>$700</td>
              <td>3 days</td>
            </tr>
            <tr>
              <td>Carrot</td>
              <td>New York - Reykjavik - Brussels</td>
              <td>$600</td>
              <td>4 days</td>
            </tr>
            <tr>
              <td>Potato</td>
              <td>Madrid - Lisbon - Moscow</td>
              <td>$800</td>
              <td>5 days</td>
            </tr>
            <tr>
              <td>Tomato</td>
              <td>Belgrade - Ljubljana - Stockholm</td>
              <td>$900</td>
              <td>6 days</td>
            </tr>
            {/* Add additional rows as needed */}
          </tbody>
        </table>
      </div>
    </>
  );
}
