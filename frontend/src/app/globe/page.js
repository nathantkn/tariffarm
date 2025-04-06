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

    // Create root element and set themes
    const root = window.am5.Root.new("chartdiv");
    root.setThemes([window.am5themes_Animated.new(root)]);

    // Create the map chart with the globe (Orthographic) projection locked in.
    const chart = root.container.children.push(
      window.am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: window.am5map.geoOrthographic()
      })
    );
    chart.set("maxZoomLevel", 3);

    // Create main polygon series for countries
    const polygonSeries = chart.series.push(
      window.am5map.MapPolygonSeries.new(root, {
        geoJSON: window.am5geodata_worldLow
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      toggleKey: "active",
      interactive: true
    });
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: root.interfaceColors.get("primaryButtonHover")
    });

    // Add graticule lines
    const graticuleSeries = chart.series.push(
      window.am5map.GraticuleSeries.new(root, {})
    );
    graticuleSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get("alternativeBackground"),
      strokeOpacity: 0.08
    });

    // Create line series for trajectory lines (invisible base lines)
    const lineSeries = chart.series.push(
      window.am5map.MapLineSeries.new(root, {})
    );
    lineSeries.mapLines.template.setAll({
      strokeOpacity: 0
    });

    // Create visible animated line series (static dotted lines)
    const animatedLineSeries = chart.series.push(
      window.am5map.MapLineSeries.new(root, {})
    );
    animatedLineSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get("alternativeBackground"),
      strokeOpacity: 1,
      strokeWidth: 2,
      strokeDasharray: [3, 3]
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
      { id: "london", title: "London", geometry: { type: "Point", coordinates: [-0.1262, 51.5002] } },
      { id: "brussels", title: "Brussels", geometry: { type: "Point", coordinates: [4.3676, 50.8371] } },
      { id: "prague", title: "Prague", geometry: { type: "Point", coordinates: [14.4205, 50.0878] } },
      { id: "athens", title: "Athens", geometry: { type: "Point", coordinates: [23.7166, 37.9792] } },
      { id: "reykjavik", title: "Reykjavik", geometry: { type: "Point", coordinates: [-21.8952, 64.1353] } },
      { id: "dublin", title: "Dublin", geometry: { type: "Point", coordinates: [-6.2675, 53.3441] } },
      { id: "oslo", title: "Oslo", geometry: { type: "Point", coordinates: [10.7387, 59.9138] } },
      { id: "lisbon", title: "Lisbon", geometry: { type: "Point", coordinates: [-9.1355, 38.7072] } },
      { id: "moscow", title: "Moscow", geometry: { type: "Point", coordinates: [37.6176, 55.7558] } },
      { id: "belgrade", title: "Belgrade", geometry: { type: "Point", coordinates: [20.4781, 44.8048] } },
      { id: "bratislava", title: "Bratislava", geometry: { type: "Point", coordinates: [17.1547, 48.2116] } },
      { id: "ljublana", title: "Ljubljana", geometry: { type: "Point", coordinates: [14.5060, 46.0514] } },
      { id: "madrid", title: "Madrid", geometry: { type: "Point", coordinates: [-3.7033, 40.4167] } },
      { id: "stockholm", title: "Stockholm", geometry: { type: "Point", coordinates: [18.0645, 59.3328] } },
      { id: "bern", title: "Bern", geometry: { type: "Point", coordinates: [7.4481, 46.9480] } },
      { id: "kiev", title: "Kiev", geometry: { type: "Point", coordinates: [30.5367, 50.4422] } },
      { id: "paris", title: "Paris", geometry: { type: "Point", coordinates: [2.3510, 48.8567] } },
      { id: "new york", title: "New York", geometry: { type: "Point", coordinates: [-74, 40.43] } }
    ];

    citySeries.data.setAll(cities);

    // Prepare line series data: connect London to selected destination cities
    const destinations = ["reykjavik", "lisbon", "moscow", "belgrade", "ljublana", "madrid", "stockholm", "bern", "kiev", "new york"];
    const originDataItem = citySeries.getDataItemById("london");

    window.am5.array.each(destinations, function (did) {
      const destinationDataItem = citySeries.getDataItemById(did);
      // Create an invisible line for the connection
      const connectionItem = lineSeries.pushDataItem({});
      connectionItem.set("pointsToConnect", [originDataItem, destinationDataItem]);

      // Create the visible dotted line (static)
      const animatedLineDataItem = animatedLineSeries.pushDataItem({});
      animatedLineDataItem.set("pointsToConnect", [originDataItem, destinationDataItem]);
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

    // Animate chart appearance (with globe rotation)
    chart.appear(1000, 100);

    chart.animate({
      key: "rotationX",
      from: 0,
      to: 360 * 2, // 2 full rotations
      duration: 15000,
      easing: am5.ease.out(am5.ease.cubic)
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

        {/* Globe (Map) Window */}
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