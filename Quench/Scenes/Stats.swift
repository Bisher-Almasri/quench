import SwiftUI
import SwiftData
import Charts
import LucideIcons

struct Stats: View {
    @AppStorage("dropletPoints") private var dropletPoints = 0
    @Environment(\.modelContext) private var modelContext
    @Query private var items: [Item]
    
    private let dailyGoal: Int = 2000
    
    private var weeklyData: [DailyStat] {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let weekStart = calendar.date(byAdding: .day, value: -6, to: today)!
        
        var days: [DailyStat] = []
        for i in 0..<7 {
            let date = calendar.date(byAdding: .day, value: i, to: weekStart)!
            let intake = items
                .filter { calendar.isDate($0.timestamp, inSameDayAs: date) }
                .reduce(0) { $0 + $1.amount }
            days.append(DailyStat(day: shortWeekday(from: date), intake: intake, goal: dailyGoal))
        }
        return days
    }
    
    private var monthlyTrend: [WeeklyTrend] {
        [
            WeeklyTrend(week: "Week 1", avg: 1850),
            WeeklyTrend(week: "Week 2", avg: 2100),
            WeeklyTrend(week: "Week 3", avg: 1950),
            WeeklyTrend(week: "Week 4", avg: 2250)
        ]
    }
    
    private var averageDailyIntake: Int {
        guard !weeklyData.isEmpty else { return 0 }
        return weeklyData.map { $0.intake }.reduce(0, +) / weeklyData.count
    }
    
    private var daysGoalMet: Int {
        weeklyData.filter { $0.intake >= $0.goal }.count
    }
    
    private var weeklyGoalProgress: Int {
        let total = weeklyData.map { $0.intake }.reduce(0, +)
        return Int(round(Double(total) / Double(dailyGoal * 7) * 100))
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 32){
                // MARK: - Header
                HStack {
                    Text("Stats")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(.waterPrimary)

                    Spacer()
                    HStack(spacing: 8) {
                        Image(uiImage: Lucide.droplets.withRenderingMode(.alwaysTemplate))
                            .foregroundColor(.waterPrimary)
                            .frame(width: 20, height: 20)
                        Text("\(dropletPoints) points")
                            .font(.subheadline)
                            .foregroundColor(Color.foreground)
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 6)
                    .background(Color.pointsBackground)
                    .cornerRadius(10)
                }
                .padding(.horizontal)
                
                // MARK: - This Week
                statCard {
                    HStack(spacing: 8) {
                        Image(uiImage: Lucide.calendar.withRenderingMode(.alwaysTemplate))
                            .foregroundColor(.blue)
                        Text("This Week")
                            .font(.headline)
                    }
                    .padding(.bottom, 8)
                    
                    HStack {
                        statMetric("\(averageDailyIntake)ml", "Daily Average", color: .blue)
                        statMetric("\(daysGoalMet)/7", "Goals Met", color: .green)
                    }
                    .padding(.bottom, 12)
                    
                    VStack(spacing: 4) {
                        HStack {
                            Text("Weekly Goal Progress")
                                .font(.subheadline).fontWeight(.medium)
                            Spacer()
                            badge(text: "\(weeklyGoalProgress)%", style: weeklyGoalProgress >= 100 ? .primary : .secondary)
                        }
                        progressBar(progress: min(Double(weeklyGoalProgress) / 100, 1.0))
                    }
                    .padding(.bottom, 12)
                    
                    Chart {
                        ForEach(weeklyData) { day in
                            BarMark(
                                x: .value("Day", day.day),
                                y: .value("Intake", day.intake)
                            )
                            .foregroundStyle(Color.blue)
                            
                            BarMark(
                                x: .value("Day", day.day),
                                y: .value("Goal", day.goal)
                            )
                            .foregroundStyle(Color.gray.opacity(0.3))
                        }
                    }
                    .frame(height: 180)
                }
                
                // MARK: - Monthly Trend
                statCard {
                    HStack(spacing: 8) {
                        Image(uiImage: Lucide.trendingUp.withRenderingMode(.alwaysTemplate))
                            .foregroundColor(.green)
                        Text("Monthly Trend")
                            .font(.headline)
                    }
                    .padding(.bottom, 8)
                    
                    Chart {
                        ForEach(monthlyTrend) { week in
                            LineMark(
                                x: .value("Week", week.week),
                                y: .value("Average", week.avg)
                            )
                            .foregroundStyle(Color.blue)
                            .symbol(Circle())
                            .lineStyle(StrokeStyle(lineWidth: 3))
                        }
                    }
                    .frame(height: 180)
                    .padding(.bottom, 8)
                    
                    VStack(spacing: 4) {
                        Text("Average Weekly Intake")
                            .font(.subheadline)
                            .foregroundColor(.mutedForeground)
                        Text("\(monthlyTrend.map{$0.avg}.reduce(0,+) / monthlyTrend.count)ml")
                            .font(.title3)
                            .bold()
                            .foregroundColor(.waterPrimary)
                    }
                }
                
                // MARK: - Quick Stats
                statCard {
                    HStack(spacing: 8) {
                        Image(uiImage: Lucide.target.withRenderingMode(.alwaysTemplate))
                            .foregroundColor(.purple)
                        Text("Quick Stats")
                            .font(.headline)
                    }
                    .padding(.bottom, 8)
                    
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        quickStat(icon: Lucide.droplets, value: "28", label: "Glasses This Week", color: .blue)
                        quickStat(icon: Lucide.target, value: "12", label: "Day Streak", color: .green)
                        quickStat(icon: Lucide.trendingUp, value: "+15%", label: "vs Last Week", color: .purple)
                        quickStat(icon: Lucide.calendar, value: "21", label: "Days Tracked", color: .yellow)
                    }
                }
            }
            .padding(.top, 20)
        }
        .background(Color.appBackground.ignoresSafeArea())
    }
}

private func shortWeekday(from date: Date) -> String {
    let formatter = DateFormatter()
    formatter.dateFormat = "EEE"
    return formatter.string(from: date)
}

// MARK: - Models
struct DailyStat: Identifiable {
    let id = UUID()
    let day: String
    let intake: Int
    let goal: Int
}

struct WeeklyTrend: Identifiable {
    let id = UUID()
    let week: String
    let avg: Int
}

// MARK: - Subviews
extension Stats {
    @ViewBuilder
    func statCard<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            content()
        }
        .padding()
        .background(RoundedRectangle(cornerRadius: 10).fill(Color.appBackground))
        .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.borderLight, lineWidth: 1))
        .padding(.horizontal)
    }
    
    @ViewBuilder
    func statMetric(_ value: String, _ label: String, color: Color) -> some View {
        VStack {
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(color)
            Text(label)
                .font(.caption)
                .foregroundColor(.mutedForeground)
        }
        .frame(maxWidth: .infinity)
    }
    
    @ViewBuilder
    func badge(text: String, style: BadgeStyle) -> some View {
        Text(text)
            .font(.caption)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(style == .primary ? Color.waterPrimary.opacity(0.1) : Color.secondary.opacity(0.1))
            .foregroundColor(style == .primary ? .waterPrimary : .secondary)
            .cornerRadius(8)
    }
    
    @ViewBuilder
    func progressBar(progress: Double) -> some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule().fill(Color.gray.opacity(0.2))
                Capsule().fill(Color.blue)
                    .frame(width: geo.size.width * progress)
            }
        }
        .frame(height: 8)
        .cornerRadius(4)
    }
    
    @ViewBuilder
    func quickStat(icon: UIImage, value: String, label: String, color: Color) -> some View {
        VStack {
            Image(uiImage: icon.withRenderingMode(.alwaysTemplate))
                .foregroundColor(color)
                .frame(width: 28, height: 28)
            Text(value)
                .font(.headline)
                .foregroundColor(color)
            Text(label)
                .font(.caption)
                .foregroundColor(color.opacity(0.8))
                .multilineTextAlignment(.center)
        }
        .padding()
        .background(RoundedRectangle(cornerRadius: 10).fill(color.opacity(0.05)))
    }
}

enum BadgeStyle {
    case primary
    case secondary
}

#Preview {
    Stats()
}
