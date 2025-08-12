import SwiftUI
import LucideIcons

struct Achievement: Identifiable {
    let id: String
    let name: String
    let description: String
    let icon: UIImage
    let requiredPoints: Int
}

struct Awards: View {
    @AppStorage("dropletPoints") private var dropletPoints = 0

    private let achievements: [Achievement] = [
        Achievement(id: "novice", name: "Novice Hydrator", description: "Reach 100 points", icon: Lucide.trophy, requiredPoints: 100),
        Achievement(id: "adept", name: "Adept Quencher", description: "Reach 500 points", icon: Lucide.medal, requiredPoints: 500),
        Achievement(id: "master", name: "Master of Waters", description: "Reach 1000 points", icon: Lucide.star, requiredPoints: 1000),
        Achievement(id: "legend", name: "Hydration Legend", description: "Reach 2000 points", icon: Lucide.crown, requiredPoints: 2000)
    ]
    
    var body: some View {
        ScrollView {
            VStack(spacing: 32) {
                // MARK: - Header
                HStack {
                    Text("Awards")
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
                
                // MARK: - Achievements Grid
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                    ForEach(achievements) { achievement in
                        AchievementCard(achievement: achievement, isUnlocked: dropletPoints >= achievement.requiredPoints)
                    }
                }
                .padding(.horizontal, 20)
            }
            .padding(.top, 20)
        }
        .background(Color.appBackground.ignoresSafeArea())
    }
}

// MARK: - Achievements Card
struct AchievementCard: View {
    let achievement: Achievement
    let isUnlocked: Bool
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 10)
                .fill(Color.appBackground)
                .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
            
            RoundedRectangle(cornerRadius: 10)
                .stroke(isUnlocked ? Color.waterPrimary : Color.inactive, lineWidth: 1)
            
            VStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(isUnlocked ? Color.waterPrimary.opacity(0.1) : Color.inactive.opacity(0.1))
                        .frame(width: 60, height: 60)
                    
                    Image(uiImage: achievement.icon.withRenderingMode(.alwaysTemplate))
                        .resizable()
                        .frame(width: 28, height: 28)
                        .foregroundColor(isUnlocked ? .waterPrimary : .inactive)
                }
                
                VStack(spacing: 6) {
                    Text(achievement.name)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color.foreground)
                        .multilineTextAlignment(.center)
                    
                    Text(achievement.description)
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(.mutedForeground)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                }
                
                Text(isUnlocked ? "Unlocked" : "Locked")
                    .font(.system(size: 12, weight: .medium))
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(isUnlocked ? Color.waterSuccess.opacity(0.1) : Color.inactive.opacity(0.1))
                    .cornerRadius(20)
                    .foregroundColor(isUnlocked ? .waterSuccess : .inactive)
            }
            .padding(20)
        }
        .frame(height: 200)
        .opacity(isUnlocked ? 1 : 0.7)
    }
}

#Preview {
    Awards()
}
