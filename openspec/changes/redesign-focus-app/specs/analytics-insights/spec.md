# analytics-insights Specification

## Purpose
Define the Insights subsection of Analytics showing focus score trends, smart insights, and personalized performance data.

## ADDED Requirements

### Requirement: Focus Score Hero Display
The Insights tab SHALL prominently display the current focus score with trend.

#### Scenario: Focus Score with Trend
- **Given** the user has recent sessions
- **When** the Insights tab loads
- **Then** a large focus score percentage should be displayed
- **And** a trend arrow should indicate improvement (↑) or decline (↓)
- **And** a comparison text should show "+X% from last week" or "-X%"

### Requirement: Focus Score Over Time Chart
The Insights tab SHALL display a line chart of focus score history.

#### Scenario: Line Chart Rendering
- **Given** the user has sessions over the past 30 days
- **When** the line chart renders
- **Then** the X-axis should show dates (last 30 days)
- **And** the Y-axis should show focus score (0-100%)
- **And** the line should use the sage color (`#C5C9A4`)
- **And** data points should be interactive (show value on hover)

#### Scenario: No Historical Data
- **Given** fewer than 2 sessions exist
- **When** the line chart would render
- **Then** an empty state should encourage more sessions
- **And** text should explain "Complete more sessions to see trends"

### Requirement: Smart Insights
The Insights tab SHALL display 3 auto-generated notable insights.

#### Scenario: Generating Smart Insights
- **Given** sufficient session data exists
- **When** the Insights tab loads
- **Then** 3 insight cards should be displayed
- **And** each insight should have a title, description, and icon
- **Examples**:
  - "🔥 You're on fire! 5-day streak and counting."
  - "📈 Your focus score improved 15% this week."
  - "⏰ You focus best in 25-minute sessions."
  - "🌅 Morning sessions have your highest scores."
  - "💪 3 more sessions until Focus Champion award!"

#### Scenario: Insufficient Data
- **Given** fewer than 5 sessions exist
- **When** insights would generate
- **Then** a prompt should encourage more sessions
- **And** text should explain what insights will show

### Requirement: Personal Insights Grid
The Insights tab SHALL display 4 personalized performance metrics.

#### Scenario: Peak Performance Insight
- **Given** sessions exist with timestamps
- **When** the Peak Performance card renders
- **Then** it should show the time window with highest average focus score
- **And** it should display that average score
- **Format**: "Morning (9-12am) • 87% avg"

#### Scenario: Focus Sweet Spot Insight
- **Given** sessions exist with varying durations
- **When** the Focus Sweet Spot card renders
- **Then** it should show the duration range with highest average focus score
- **And** it should display that average score
- **Format**: "25-30 min sessions • 92% avg"

#### Scenario: Average Session Insight
- **Given** sessions exist
- **When** the Average Session card renders
- **Then** it should show the typical session length
- **Format**: "27 minutes"

#### Scenario: Monthly Total Insight
- **Given** sessions exist in the last 30 days
- **When** the Monthly Total card renders
- **Then** it should show total focused time in hours and minutes
- **Format**: "12h 45m"

### Requirement: Insights Layout
The Personal Insights SHALL be displayed in a 2x2 grid layout.

#### Scenario: Grid Rendering
- **Given** the 4 personal insights
- **When** they render
- **Then** they should appear in a 2-column grid on desktop
- **And** they should stack to single column on mobile
- **And** each card should have a subtle background and icon
