import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import colors from '../../constants/colors';
import { actuatedNormalize } from '../../constants/PixelScaling';
import { fonts } from '../../constants/fonts';
import { formatDateTime } from '../../utils/formatedateTime';

interface ReportCardProps {
  reportName: string;
  status: 'pending' | 'resolved';
  resolvedTime?: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ reportName, status, resolvedTime }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.reportName} numberOfLines={2}>{reportName}</Text>
        <ProgressBar
          progress={status === 'resolved' ? 1 : 0.5}
          color={status === 'resolved' ? colors.primary : colors.yellow}
          style={styles.progressBar}
        />
        <Text style={[styles.status, { color: status === 'resolved' ? colors.primary : colors.yellow }]}>
          {status === 'resolved' ? 'Resolved' : 'Pending'}
        </Text>
        {status === 'resolved' && resolvedTime && (
          <Text style={styles.resolvedTime}>Resolved Time: {formatDateTime(resolvedTime,"")}</Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: actuatedNormalize(10),
    padding: actuatedNormalize(10),
    backgroundColor:colors.dark
  },
  reportName: {
    fontSize: 18,
    fontFamily:fonts.NexaBold,
    color:colors.white,
    marginBottom: actuatedNormalize(10),
  },
  progressBar: {
    height: actuatedNormalize(10),
    borderRadius: actuatedNormalize(5),
    marginBottom: actuatedNormalize(10),
  },
  status: {
    fontSize: actuatedNormalize(16),
    marginBottom: actuatedNormalize(5),
    fontFamily:fonts.NexaBold,

  },
  resolvedTime: {
    fontSize: actuatedNormalize(14),
    color: colors.gray,
    fontFamily:fonts.NexaRegular,

  },
});

export default ReportCard;
