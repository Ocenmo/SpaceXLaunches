import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Launch } from "@/types/launch.types";

interface LaunchCardProps {
    launch: Launch;
    onPress: () => void;
}

export const LaunchCard: React.FC<LaunchCardProps> = ({ launch, onPress }) => {
    const getStatusColor = (success: boolean | null) => {
        if (success === null) return '#6b7280'; // gray-500
        return success ? '#10b981' : '#ef4444'; // green-500 : red-500
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString();
    };

    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{launch.name}</Text>
                    <Text style={styles.date}>
                        {formatDate(new Date(launch.date_utc))}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(launch.success) }]}>
                        <Text style={styles.statusText}>
                            {launch.upcoming ? "Upcoming" : (launch.success ? "Successful" : "Failed")}
                        </Text>
                    </View>
                </View>
                {launch.links?.patch?.small && (
                    <Image
                        source={{ uri: launch.links.patch.small }}
                        style={styles.image}
                    />
                )}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        padding: 16,
        margin: 8,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    date: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    statusBadge: {
        marginTop: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 4,
    },
});