import { View } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const OrdersSkeleton = () => {


    return (

        // <SkeletonPlaceholder borderRadius={4} enabled={true} direction='right'>
        //     <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        //         {[1, 2, 3, 4, 5, 6].map((index) => (
        //             <View key={index} style={{ gap: 10, justifyContent: 'center', alignItems: 'center', padding: '2%', width: '45%' }}>
        //                 <View style={{ width: 150, height: 150 }} />
        //                 <View style={{ width: 80, height: 20 }} />
        //                 <View style={{ width: 80, height: 20 }} />
        //             </View>
        //         ))}
        //     </View>
        // </SkeletonPlaceholder>

        // <SkeletonPlaceholder borderRadius={4} alignItems="center" justifyContent="center">
        //     <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
        //         <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
        //         <SkeletonPlaceholder.Item marginLeft={20}>

        //             <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" justifyContent="space-between" gap={10}>
        //                 <SkeletonPlaceholder.Item width={100} height={15} />
        //                 <SkeletonPlaceholder.Item width={100} height={15} />

        //             </SkeletonPlaceholder.Item>



        //             <SkeletonPlaceholder.Item marginTop={6} width={80} height={10} />
        //             <SkeletonPlaceholder.Item marginTop={6} width={80} height={10} />

        //         </SkeletonPlaceholder.Item>
        //     </SkeletonPlaceholder.Item>
        // </SkeletonPlaceholder>

        <SkeletonPlaceholder borderRadius={4} enabled={true} direction='right'>


            {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (

                <View style={{ alignItems: 'center', flexDirection: 'row', marginVertical:'5%', gap:10, paddingHorizontal:'4%' }}>


                    {/* Icon */}
                    <View style={{ width: 60, height: 60, borderRadius: 60 }} />

                    <View style={{ gap: 5 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                            {/* Order Name */}
                            <View style={{ width: 100, height: 20 }} />

                            {/* Cancel Button */}
                            <View style={{ width: 100, height: 30, borderRadius: 30 }} />
                        </View>


                        {/* date */}
                        <View style={{ width: 100, height: 10 }} />


                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>

                            {/* Total SKU */}
                            <View style={{ width: 100, height: 10 }} />

                            {/* Total Price */}
                            <View style={{ width: 100, height: 10, marginLeft: '25%' }} />
                        </View>


                    </View>

                </View>

            ))}



        </SkeletonPlaceholder>

    );
}

export default OrdersSkeleton;