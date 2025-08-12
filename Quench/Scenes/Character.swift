import SwiftUI
import LucideIcons
// MARK: - Types

// INFO: Codable = Can be turned into JSON and back
struct Character: Codable {
    var name: String
    var level: Int
    var experience: Float
    var experienceToNext: Float
    var health: Float
    var energy: Float
    var hydration: Float
}

struct Upgrade: Identifiable {
    let id: String
    let name: String
    let description: String
    let cost: Int
    let icon: UIImage
    let effect: String
}

// MARK: - Character Storage
@propertyWrapper
struct CodableStorage<T: Codable> {
    let key: String;
    let defaultValue: T;
    let container: UserDefaults = .standard;
    
    var wrappedValue: T {
        get {
            if let data = container.data(forKey: key), let value = try? JSONDecoder().decode(T.self, from: data) {
                return value
            }
            return defaultValue
        }
        
        nonmutating set {
            if let data = try? JSONEncoder().encode(newValue) {
                container.set(data, forKey: key)
            }
        }
    }
}

// MARK: - Main View
struct CharacterView: View {
    @AppStorage("dropletPoints") private var dropletPoints = 0
    @State private var showPurchaseEffect = false
    @State private var purchasedUpgradeId: String = ""
    
    @CodableStorage(key: "characterData", defaultValue: Character(
            name: "Hydro",
            level: 1,
            experience: 0,
            experienceToNext: 200,
            health: 100,
            energy: 100,
            hydration: 100
        )) private var character
    
    @State private var upgrades: [Upgrade] = [
        Upgrade(
            id: "energy",
            name: "Energy Drink",
            description: "Restore energy to full capacity",
            cost: 30,
            icon: Lucide.zap.withRenderingMode(.alwaysTemplate),
            effect: "Full Energy"
        ),
        Upgrade(
            id: "hydrate",
            name: "Glass Of Water",
            description: "Increases Water by 10 points",
            cost: 30,
            icon: Lucide.glassWater.withRenderingMode(.alwaysTemplate),
            effect: "+10 Water"
        ),
        Upgrade(
            id: "health",
            name: "Health Boost",
            description: "Increase max health by 10 points",
            cost: 50,
            icon: Lucide.heart.withRenderingMode(.alwaysTemplate),
            effect: "+10 Health"
        ),
        Upgrade(
            id: "protection",
            name: "Hydro Shield",
            description: "Protect against dehydration effects",
            cost: 100,
            icon: Lucide.shield.withRenderingMode(.alwaysTemplate),
            effect: "Dehydration Protection"
        )
    ]
    
    private var experienceProgress: Float {
        (character.experience / character.experienceToNext) * 100
    }
    
    private func purchaseUpgrade(_ upgrade: Upgrade) {
        if dropletPoints >= upgrade.cost {
            dropletPoints -= upgrade.cost
            purchasedUpgradeId = upgrade.id
            withAnimation(.spring()) {
                showPurchaseEffect = true
            }
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                withAnimation {
                    switch upgrade.id {
                    case "health":
                        character = {
                            var updated = character
                            updated.health = min(100, character.health + 10)
                            return updated
                        }()
                    case "energy":
                        character = {
                            var updated = character
                            updated.energy = 100
                            return updated
                        }()
                    case "hydrate":
                        character = {
                            var updated = character
                            updated.hydration = min(100, character.hydration + 10)
                            return updated
                        }()
                    default: break
                    }
                    
                    character.experience += 20
                    
                    if character.experience >= character.experienceToNext {
                        character.level += 1
                        character.experience = character.experience - character.experienceToNext
                        character.experienceToNext = floor(character.experienceToNext * 1.5)
                    }
                }
                
                withAnimation(.easeOut(duration: 0.5)) {
                    showPurchaseEffect = false
                }
            }
        }
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 32){
                // MARK: - Header
                HStack {
                    Text("Character")
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
                
                // MARK: - Main Card/Player Card
                ZStack {
                    RoundedRectangle(cornerRadius: 10)
                        .fill(
                            LinearGradient(
                                colors: [Color.cardGradientStart, Color.cardGradientEnd],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        ).overlay(
                            RoundedRectangle(cornerRadius: 10)
                                .stroke(Color.borderLight, lineWidth: 1)
                        )
                    
//                    WaterWaveShape()
//                        .fill(Color.waterPrimary.opacity(0.08))
//                        .frame(height: 120)
//                        .offset(y: 60)
                    
                    VStack(spacing: 0) {
                        ZStack {
                            Circle()
                                .fill(
                                    LinearGradient(
                                        colors: [Color.waterPrimary, Color.waterSecondary],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 140, height: 140)
                                .shadow(color: .waterPrimary.opacity(0.3), radius: 16, x: 0, y: 8)
                            
                            Image(uiImage: Lucide.droplets.withRenderingMode(.alwaysTemplate))
                                .resizable()
                                .frame(width: 64, height: 64)
                                .foregroundColor(.white)
                                .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
                        }
                        .padding(.top, 32)
                        .padding(.bottom, 16)
                        
                        VStack(spacing: 8) {
                            Text(character.name)
                                .font(.system(size: 24, weight: .bold))
                                .foregroundColor(.waterPrimary)
                            
                            Text("Level \(character.level)")
                                .font(.system(size: 18, weight: .medium))
                                .padding(.horizontal, 20)
                                .padding(.vertical, 6)
                                .background(
                                    Capsule()
                                        .fill(Color.pointsBackground)
                                )
                        }
                        .padding(.bottom, 24)
                        
                        VStack(spacing: 8) {
                            HStack {
                                Text("Experience")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.mutedForeground)
                                
                                Spacer()
                                
                                Text("\(Int(character.experience))/\(Int(character.experienceToNext))")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.waterPrimary)
                            }
                            
                            GeometryReader { geometry in
                                ZStack(alignment: .leading) {
                                    RoundedRectangle(cornerRadius: 4)
                                        .fill(Color.borderLight)
                                        .frame(height: 12)
                                    
                                    RoundedRectangle(cornerRadius: 4)
                                        .fill(
                                            LinearGradient(
                                                gradient: Gradient(colors: [Color.waterPrimary, Color.waterSecondary]),
                                                startPoint: .leading,
                                                endPoint: .trailing
                                            )
                                        )
                                        .frame(width: geometry.size.width * CGFloat(experienceProgress / 100), height: 12)
                                }
                            }
                            .frame(height: 12)
                        }
                        .padding(.horizontal, 24)
                        .padding(.bottom, 24)
                        
                        HStack(spacing: 16) {
                            StatsComponent(
                                icon: Lucide.heart.withRenderingMode(.alwaysTemplate),
                                name: "Health",
                                value: character.health,
                                color: .red
                            )
                            
                            StatsComponent(
                                icon: Lucide.zap.withRenderingMode(.alwaysTemplate),
                                name: "Energy",
                                value: character.energy,
                                color: .yellow
                            )
                            
                            StatsComponent(
                                icon: Lucide.droplets.withRenderingMode(.alwaysTemplate),
                                name: "Water",
                                value: character.hydration,
                                color: .purple
                            )
                        }
                        .padding(.horizontal, 24)
                        .padding(.bottom, 32)
                    }
                }
                .padding(.horizontal, 20)
                .frame(height: 480)
                .padding(.bottom, 40)
                
                // MARK: - Upgrades
                VStack(spacing: 0) {
                    HStack {
                        Image(uiImage: Lucide.droplets.withRenderingMode(.alwaysTemplate))
                            .resizable()
                            .frame(width: 24, height: 24)
                            .foregroundColor(.waterPrimary)
                        
                        Text("Upgrades")
                            .font(.system(size: 22, weight: .bold))
                            .foregroundColor(.waterPrimary)
                        
                        Spacer()
                    }
                    .padding(.horizontal, 24)
                    .padding(.bottom, 16)
                    
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                        ForEach(upgrades) { upgrade in
                            UpgradeComponent(
                                upgrade: upgrade,
                                canAfford: dropletPoints >= upgrade.cost,
                                isPurchased: purchasedUpgradeId == upgrade.id && showPurchaseEffect
                            )
                            .onTapGesture {
                                purchaseUpgrade(upgrade)
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 40)
                }
            }
            .padding(.top, 20)

        }
        .background(Color.appBackground.ignoresSafeArea())
    }
}

// MARK: - Stats Component
struct StatsComponent: View {
    let icon: UIImage
    let name: String
    let value: Float
    let color: Color
    
    var body: some View {
        VStack(spacing: 8) {
            HStack(spacing: 8) {
                Image(uiImage: icon)
                    .resizable()
                    .frame(width: 20, height: 20)
                    .foregroundColor(color)
                
                Text(name)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.mutedForeground)
            }
            
            Text("\(Int(value))%")
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(color)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)

    }
}

// MARK: - Upgrade Component
struct UpgradeComponent: View {
    let upgrade: Upgrade
    let canAfford: Bool
    var isPurchased: Bool = false
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 10)
                .fill(LinearGradient(
                    colors: [Color.cardGradientStart, Color.cardGradientEnd],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                ))
                .shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 4)
            
            RoundedRectangle(cornerRadius: 10)
                .stroke(canAfford ? Color.waterPrimary : Color.inactive, lineWidth: 1)
            
            VStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(canAfford ? Color.waterPrimary.opacity(0.1) : Color.inactive.opacity(0.1))
                        .frame(width: 60, height: 60)
                    
                    Image(uiImage: upgrade.icon)
                        .resizable()
                        .frame(width: 28, height: 28)
                        .foregroundColor(canAfford ? .waterPrimary : .inactive)
                }
                .scaleEffect(isPurchased ? 1.2 : 1)
                .animation(.spring(response: 0.3, dampingFraction: 0.5), value: isPurchased)
                
                VStack(spacing: 6) {
                    Text(upgrade.name)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color.foreground)
                        .multilineTextAlignment(.center)
                    
                    Text(upgrade.description)
                        .font(.system(size: 14, weight: .regular))
                        .foregroundColor(.mutedForeground)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                    
                    Text(upgrade.effect)
                        .font(.system(size: 12, weight: .medium))
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(canAfford ? Color.waterPrimary.opacity(0.1) : Color.inactive.opacity(0.1))
                        .cornerRadius(20)
                        .foregroundColor(canAfford ? .waterPrimary : .inactive)
                }
                
                HStack(spacing: 6) {
                    Image(uiImage: Lucide.droplets.withRenderingMode(.alwaysTemplate))
                        .resizable()
                        .frame(width: 16, height: 16)
                        .foregroundColor(canAfford ? .waterPrimary : .inactive)
                    
                    Text("\(upgrade.cost)")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(canAfford ? .waterPrimary : .inactive)
                }
                .padding(.top, 4)
            }
            .padding(20)
        }
        .frame(height: 220)
        .opacity(canAfford ? 1 : 0.7)
    }
}

//struct WaterWaveShape: Shape {
//    func path(in rect: CGRect) -> Path {
//        var path = Path()
//        
//        let waveHeight: CGFloat = 20
//        let startY = rect.maxY - waveHeight
//        
//        path.move(to: CGPoint(x: rect.minX, y: startY))
//        
//        // Create wave pattern
//        let wavelength = rect.width / 2
//        for x in stride(from: 0, through: rect.width, by: 1) {
//            let relativeX = x / wavelength
//            let y = waveHeight * sin(relativeX * .pi * 2)
//            path.addLine(to: CGPoint(x: x, y: startY + y))
//        }
//        
//        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
//        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
//        path.closeSubpath()
//        
//        return path
//    }
//}

#Preview {
    CharacterView()
}
