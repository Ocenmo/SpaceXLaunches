import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    Alert,
} from 'react-native';
import { Launch, RocketDetail, LaunchpadDetail } from '@/types/launch.types';
import { useLaunchService } from '@/hooks/useLaunchService';

interface LaunchDetailScreenProps {
    route: {
        params: {
        launchId: string;
        };
    };
    navigation: any;
}

interface LaunchDetailData {
    launch: Launch;
    rocket: RocketDetail;
    launchpad: LaunchpadDetail;
}

export const LaunchDetailScreen: React.FC<LaunchDetailScreenProps> = ({
    route,
    navigation
}) => {
    const { launchId } = route.params;
    const [launchData, setLaunchData] = useState<LaunchDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const launchService = useLaunchService();

    useEffect(() => {
        loadLaunchDetails();
    }, [launchId]);

    const loadLaunchDetails = async () => {
        try {
        setLoading(true);
        setError(null);
        const details = await launchService.getLaunchDetails(launchId);
        setLaunchData(details);
        } catch (err) {
        setError('Failed to load launch details');
        console.error('Error loading launch details:', err);
        } finally {
        setLoading(false);
        }
    };

    const handleOpenWebcast = async (url: string) => {
        try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Error', 'Cannot open this link');
        }
        } catch (error) {
        Alert.alert('Error', 'Failed to open webcast');
        }
    };

    const handleOpenArticle = async (url: string) => {
        try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Error', 'Cannot open this link');
        }
        } catch (error) {
        Alert.alert('Error', 'Failed to open article');
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        });
    };

    const getStatusColor = (success: boolean | null, upcoming: boolean) => {
        if (upcoming) return 'bg-blue-500';
        if (success === null) return 'bg-gray-500';
        return success ? 'bg-green-500' : 'bg-red-500';
    };

    const getStatusText = (success: boolean | null, upcoming: boolean) => {
        if (upcoming) return 'Upcoming';
        if (success === null) return 'Unknown';
        return success ? 'Success' : 'Failed';
    };

    if (loading) {
        return (
        <View className="flex-1 justify-center items-center bg-gray-100">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="mt-2 text-gray-600">Loading launch details...</Text>
        </View>
        );
    }

    if (error || !launchData) {
        return (
        <View className="flex-1 justify-center items-center bg-gray-100">
            <Text className="text-red-500 text-lg mb-4">{error || 'Launch not found'}</Text>
            <TouchableOpacity
            onPress={loadLaunchDetails}
            className="bg-blue-500 px-6 py-3 rounded-lg"
            >
            <Text className="text-white font-medium">Retry</Text>
            </TouchableOpacity>
        </View>
        );
    }

    const { launch, rocket, launchpad } = launchData;

    return (
        <ScrollView className="flex-1 bg-gray-100">
        {/* Header Image */}
        {launch.links?.patch?.large && (
            <View className="h-64 bg-black">
            <Image
                source={{ uri: launch.links.patch.large }}
                className="w-full h-full"
                resizeMode="contain"
            />
            </View>
        )}

        <View className="p-4">
            {/* Mission Name and Status */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
                {launch.name}
            </Text>

            <View className="flex-row items-center justify-between">
                <View className={`px-3 py-1 rounded-full ${getStatusColor(launch.success, launch.upcoming)}`}>
                <Text className="text-white font-medium">
                    {getStatusText(launch.success, launch.upcoming)}
                </Text>
                </View>

                <Text className="text-gray-600">
                Flight #{launch.flight_number}
                </Text>
            </View>
            </View>

            {/* Launch Date */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
                Launch Date
            </Text>
            <Text className="text-gray-600">
                {formatDate(launch.date_utc)}
            </Text>
            </View>

            {/* Mission Details */}
            {launch.details && (
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                Mission Details
                </Text>
                <Text className="text-gray-600 leading-6">
                {launch.details}
                </Text>
            </View>
            )}

            {/* Rocket Information */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
                Rocket
            </Text>
            <Text className="text-gray-600 text-base">
                {rocket.name}
            </Text>
            {rocket.description && (
                <Text className="text-gray-500 text-sm mt-1">
                {rocket.description}
                </Text>
            )}
            {rocket.height && (
                <Text className="text-gray-500 text-sm mt-1">
                Height: {rocket.height.meters}m ({rocket.height.feet}ft)
                </Text>
            )}
            </View>

            {/* Launchpad Information */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
                Launchpad
            </Text>
            <Text className="text-gray-600 text-base">
                {launchpad.full_name}
            </Text>
            {launchpad.locality && launchpad.region && (
                <Text className="text-gray-500 text-sm mt-1">
                {launchpad.locality}, {launchpad.region}
                </Text>
            )}
            {launchpad.launch_successes !== undefined && launchpad.launch_attempts !== undefined && (
                <Text className="text-gray-500 text-sm mt-1">
                Success Rate: {launchpad.launch_successes}/{launchpad.launch_attempts} launches
                </Text>
            )}
            </View>

            {/* Core Information */}
            {launch.cores && launch.cores.length > 0 && (
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                Boosters
                </Text>
                {launch.cores.map((core, index) => (
                <View key={index} className="mb-2 last:mb-0">
                    <Text className="text-gray-600">
                    Core {index + 1}: {core.flight ? `Flight #${core.flight}` : 'New core'}
                    </Text>
                    {core.reused && (
                    <Text className="text-blue-600 text-sm">• Reused core</Text>
                    )}
                    {core.landing_attempt && (
                    <Text className={`text-sm ${core.landing_success ? 'text-green-600' : 'text-red-600'}`}>
                        • Landing {core.landing_success ? 'successful' : 'failed'}
                        {core.landing_type && ` (${core.landing_type})`}
                    </Text>
                    )}
                </View>
                ))}
            </View>
            )}

            {/* Failures */}
            {launch.failures && launch.failures.length > 0 && (
            <View className="bg-red-50 rounded-lg p-4 mb-4 border border-red-200">
                <Text className="text-lg font-semibold text-red-800 mb-2">
                Mission Failures
                </Text>
                {launch.failures.map((failure, index) => (
                <View key={index} className="mb-2 last:mb-0">
                    <Text className="text-red-600 font-medium">
                    T+{failure.time}s
                    </Text>
                    <Text className="text-red-700">
                    {failure.reason}
                    </Text>
                    {failure.altitude && (
                    <Text className="text-red-600 text-sm">
                        Altitude: {failure.altitude}km
                    </Text>
                    )}
                </View>
                ))}
            </View>
            )}

            {/* Links */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
                Links
            </Text>

            <View className="space-y-2">
                {launch.links?.webcast && (
                <TouchableOpacity
                    onPress={() => handleOpenWebcast(launch.links!.webcast!)}
                    className="bg-red-500 px-4 py-3 rounded-lg flex-row items-center justify-center"
                >
                    <Text className="text-white font-medium">
                    Watch Webcast
                    </Text>
                </TouchableOpacity>
                )}

                {launch.links?.article && (
                <TouchableOpacity
                    onPress={() => handleOpenArticle(launch.links!.article!)}
                    className="bg-blue-500 px-4 py-3 rounded-lg flex-row items-center justify-center mt-2"
                >
                    <Text className="text-white font-medium">
                    Read Article
                    </Text>
                </TouchableOpacity>
                )}

                {launch.links?.wikipedia && (
                <TouchableOpacity
                    onPress={() => handleOpenArticle(launch.links!.wikipedia!)}
                    className="bg-gray-600 px-4 py-3 rounded-lg flex-row items-center justify-center mt-2"
                >
                    <Text className="text-white font-medium">
                    Wikipedia
                    </Text>
                </TouchableOpacity>
                )}
            </View>
            </View>

            {/* Flickr Images */}
            {launch.links?.flickr?.original && launch.links.flickr.original.length > 0 && (
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                <Text className="text-lg font-semibold text-gray-800 mb-3">
                Mission Photos
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {launch.links.flickr.original.map((imageUrl, index) => (
                    <Image
                    key={index}
                    source={{ uri: imageUrl }}
                    className="w-32 h-32 rounded-lg mr-3"
                    resizeMode="cover"
                    />
                ))}
                </ScrollView>
            </View>
            )}
        </View>
        </ScrollView>
    );
};