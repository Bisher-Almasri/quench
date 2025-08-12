//
//  Item.swift
//  Quench
//
//  Created by Bisher Almasri on 2025-08-11.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    var amount: Int
    
    init(timestamp: Date, amount: Int) {
        self.timestamp = timestamp
        self.amount = amount
    }
}
