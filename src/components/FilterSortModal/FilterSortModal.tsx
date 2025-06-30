// src/components/FilterSortModal/FilterSortModal.tsx
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Pressable,
} from 'react-native';
import { SortOption, FilterOption } from '@/types/launch.types';

interface FilterSortModalProps {
    visible: boolean;
    onClose: () => void;
    currentFilter: FilterOption;
    currentSort: SortOption;
    onFilterChange: (filter: FilterOption) => void;
    onSortChange: (sort: SortOption) => void;
    type: 'filter' | 'sort';
}

export const FilterSortModal: React.FC<FilterSortModalProps> = ({
    visible,
    onClose,
    currentFilter,
    currentSort,
    onFilterChange,
    onSortChange,
    type,
}) => {
    const filterOptions: { value: FilterOption; label: string }[] = [
        { value: 'all', label: 'All Launches' },
        { value: 'success', label: 'Successful Only' },
        { value: 'failed', label: 'Failed Only' },
    ];

    const sortOptions: { value: SortOption; label: string }[] = [
        { value: 'date_desc', label: 'Newest First' },
        { value: 'date_asc', label: 'Oldest First' },
        { value: 'name_asc', label: 'Name A-Z' },
        { value: 'name_desc', label: 'Name Z-A' },
    ];

    const handleOptionSelect = (option: FilterOption | SortOption) => {
        if (type === 'filter') {
        onFilterChange(option as FilterOption);
        } else {
        onSortChange(option as SortOption);
        }
        onClose();
    };

    const options = type === 'filter' ? filterOptions : sortOptions;
    const currentValue = type === 'filter' ? currentFilter : currentSort;

    return (
        <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
        >
        <Pressable
            className="flex-1 bg-black/50 justify-end"
            onPress={onClose}
        >
            <Pressable
            className="bg-white rounded-t-3xl"
            onPress={(e) => e.stopPropagation()}
            >
            <View className="p-6">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-gray-800">
                    {type === 'filter' ? 'Filter Launches' : 'Sort Launches'}
                </Text>
                <TouchableOpacity
                    onPress={onClose}
                    className="w-8 h-8 rounded-full bg-gray-200 justify-center items-center"
                >
                    <Text className="text-gray-600 font-bold">✕</Text>
                </TouchableOpacity>
                </View>

                {/* Options */}
                <ScrollView showsVerticalScrollIndicator={false}>
                {options.map((option) => (
                    <TouchableOpacity
                    key={option.value}
                    onPress={() => handleOptionSelect(option.value)}
                    className={`p-4 rounded-xl mb-3 border-2 ${
                        currentValue === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    >
                    <View className="flex-row justify-between items-center">
                        <Text
                        className={`text-base font-medium ${
                            currentValue === option.value
                            ? 'text-blue-700'
                            : 'text-gray-700'
                        }`}
                        >
                        {option.label}
                        </Text>
                        {currentValue === option.value && (
                        <View className="w-6 h-6 rounded-full bg-blue-500 justify-center items-center">
                            <Text className="text-white text-xs font-bold">✓</Text>
                        </View>
                        )}
                    </View>
                    </TouchableOpacity>
                ))}
                </ScrollView>

                {/* Action Buttons */}
                <View className="flex-row gap-3 mt-6">
                <TouchableOpacity
                    onPress={onClose}
                    className="flex-1 bg-gray-200 p-4 rounded-xl"
                >
                    <Text className="text-center text-gray-700 font-semibold">
                    Cancel
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                    if (type === 'filter') {
                        onFilterChange('all');
                    } else {
                        onSortChange('date_desc');
                    }
                    onClose();
                    }}
                    className="flex-1 bg-blue-500 p-4 rounded-xl"
                >
                    <Text className="text-center text-white font-semibold">
                    Reset
                    </Text>
                </TouchableOpacity>
                </View>
            </View>
            </Pressable>
        </Pressable>
        </Modal>
    );
};