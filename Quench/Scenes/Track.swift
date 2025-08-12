//
//  Track.swift
//  Quench
//
//  Created by Bisher Almasri on 2025-08-12.
//

import SwiftUI
import LucideIcons
import SwiftData

struct Track: View {
    @Environment(\.modelContext) private var modelContext
    @Query private var items: [Item]
    
    @AppStorage("dropletPoints") private var dropletPoints = 0

    private var todaysItems: [Item] {
        let calendar = Calendar.current
        return items.filter { calendar.isDateInToday($0.timestamp) }
    }
    
    private var dailyIntake: Int {
        todaysItems.reduce(0) { $0 + $1.amount }
    }
    
    private let dailyGoal: Int = 2000
    @State private var showAnimation: Bool = false

    private var dailyProgress: CGFloat {
        CGFloat(min(Double(dailyIntake) / Double(dailyGoal), 1.0))
    }
    
    private var glassesCompleted: Int {
        dailyIntake / 250
    }
    
    private var currentHour: Int {
        Calendar.current.component(.hour, from: Date())
    }
    
    private var targetHourlyIntake: Int {
        let hoursPassed = max(0, currentHour - 6)
        if hoursPassed <= 0 { return 0 }
        return Int(round(Double(dailyGoal) / 16.0 * Double(hoursPassed)))
    }
    
    private var hourlyProgress: CGFloat {
        guard targetHourlyIntake > 0 else { return 0 }
        return CGFloat(min(Double(dailyIntake) / Double(targetHourlyIntake), 1.0))
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 32) {
                // MARK: - Header
                HStack {
                    Text("Track")
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

                // MARK: - Progress Card
                ZStack {
                    RoundedRectangle(cornerRadius: 10)
                        .fill(
                            LinearGradient(
                                colors: [Color.cardGradientStart, Color.cardGradientEnd],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(height: 350)
                        .overlay(
                            RoundedRectangle(cornerRadius: 10)
                                .stroke(Color.borderLight, lineWidth: 1)
                        )
                    
                    VStack(spacing: 20) {
                        ZStack {
                            Circle()
                                .stroke(Color.waterGlassBorder, lineWidth: 20)
                                .frame(width: 180, height: 180)
                            
                            Circle()
                                .trim(from: 0, to: dailyProgress)
                                .stroke(
                                    LinearGradient(
                                        gradient: Gradient(colors: [Color.waterPrimary, Color.waterSecondary]),
                                        startPoint: .top,
                                        endPoint: .bottom
                                    ),
                                    style: StrokeStyle(lineWidth: 20, lineCap: .round)
                                )
                                .rotationEffect(.degrees(-90))
                                .frame(width: 180, height: 180)
                                .animation(.easeInOut(duration: 0.5), value: dailyProgress)

                            VStack(spacing: 6) {
                                Image(uiImage: Lucide.droplets.withRenderingMode(.alwaysTemplate))
                                    .resizable()
                                    .renderingMode(.template)
                                    .foregroundColor(Color.waterPrimary)
                                    .frame(width: 48, height: 48)
                                
                                Text("\(dailyIntake) ml")
                                    .font(.title)
                                    .fontWeight(.bold)
                                
                                Text("of \(dailyGoal) ml")
                                    .foregroundColor(Color.mutedForeground)
                            }
                        }
                        
                        Text(dailyProgress >= 1 ? "Daily Goal Complete!" : "\(Int(dailyProgress * 100))% of daily goal")
                            .font(.headline)
                            .foregroundColor(Color.headlineForeground)
                            .padding(.top)
                        
                        Text("\(todaysItems.count) glasses completed")
                            .font(.subheadline)
                            .foregroundColor(Color.subheadlineForeground)
                    }
                }
                .padding(.horizontal)

                //TODO: TEMP
                // MARK: - Water adder
                LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 16), count: 3), spacing: 16) {
                    ForEach([250, 500, 750], id: \.self) { amount in
                        Button {
                            addWater(amount: amount)
                        } label: {
                            VStack(spacing: 8) {
                                Image(uiImage: Lucide.droplets.withRenderingMode(.alwaysTemplate))
                                    .resizable()
                                    .frame(width: 20, height: 20)
                                    .foregroundColor(Color.waterPrimary)
                                Text("\(amount) ml")
                                    .font(.caption)
                                    .fontWeight(.medium)
                                    .foregroundColor(Color.waterPrimary)
                            }
                            .frame(maxWidth: .infinity, minHeight: 60)
                            .background(Color.appBackground)
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color.waterLight)
                            )
                        }
                    }
                }
                .padding(.horizontal)
                
                // MARK: - Water Target
                VStack(alignment: .leading, spacing: 16) {
                    HStack(spacing: 12) {
                        Image(uiImage: Lucide.target.withRenderingMode(.alwaysTemplate))
                            .resizable()
                            .frame(width: 20, height: 20)
                            .foregroundColor(.waterPrimary)
                        Text("Water Target")
                            .font(.headline)
                    }
                    
                    HStack {
                        Text("Target by now: \(targetHourlyIntake) ml")
                        Spacer()
                        Text(hourlyProgress >= 1 ? "On track!" :
                             hourlyProgress >= 0.8 ? "Close" : "Behind")
                            .foregroundColor(hourlyProgress >= 1 ? Color.waterSuccess :
                                                hourlyProgress >= 0.8 ? Color.waterWarning : Color.waterDanger)
                    }
                    .font(.subheadline)

                    ProgressView(value: hourlyProgress)
                        .progressViewStyle(LinearProgressViewStyle(tint: Color.waterPrimary))
                        .frame(height: 12)
                        .cornerRadius(4)
                    
                    HStack(spacing: 32) {
                        VStack {
                            Text("\(todaysItems.count)")
                                .font(.title)
                                .fontWeight(.bold)

                            Text("Drinks")
                                .font(.caption)
                                .foregroundColor(Color.inactive)
                        }
                        .frame(maxWidth: .infinity)
                        .multilineTextAlignment(.center)
                        
                        VStack {
                            Text("\(glassesCompleted)")
                                .font(.title)
                                .fontWeight(.bold)
                            Text("Glasses")
                                .font(.caption)
                                .foregroundColor(Color.inactive)
                        }
                        .frame(maxWidth: .infinity)
                        .multilineTextAlignment(.center)
                        
                        VStack {
                            Text("\(Int(hourlyProgress * 100))%")
                                .font(.title)
                                .fontWeight(.bold)
                            Text("On Pace")
                                .font(.caption)
                                .foregroundColor(Color.inactive)
                        }
                        .frame(maxWidth: .infinity)
                        .multilineTextAlignment(.center)
                    }

                }
                .padding()
                .background(Color.appBackground)
                .cornerRadius(10)
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                                              .stroke(Color.borderLight, lineWidth: 1)
                )
                .padding(.horizontal)

                Spacer(minLength: 40)
            }
            .padding(.top, 20)
        }
        .background(Color.appBackground.ignoresSafeArea())
    }
    
    func addWater(amount: Int) {
        let newItem = Item(timestamp: Date(), amount: amount)
        modelContext.insert(newItem)
        dropletPoints += amount / 100
         
        withAnimation(.spring()) {
            showAnimation = true
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            withAnimation(.spring()) {
                showAnimation = false
            }
        }
    }
}

#Preview {
    Track()
}
