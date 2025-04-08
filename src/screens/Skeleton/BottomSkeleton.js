import { View, ScrollView } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const BottomSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={4} enabled={true} direction="right">
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">

          {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
            <>
              <SkeletonPlaceholder.Item flexDirection="row" alignItems="center"  marginBottom={20}>
                <SkeletonPlaceholder.Item
                  width={70}
                  height={70}
                  borderRadius={50}
                  marginLeft={16}
                />
                <SkeletonPlaceholder.Item
                  flexDirection="column"
                  alignItems="center"
                >
                  <SkeletonPlaceholder.Item
                    width={90}
                    height={20}
                    borderRadius={5}
                    marginLeft={16}
                    marginBottom={5}
                  />
                  <SkeletonPlaceholder.Item
                    width={90}
                    height={20}
                    borderRadius={5}
                    marginLeft={16}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </>
          ))}
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </SkeletonPlaceholder>
  );
};

export default BottomSkeleton;
