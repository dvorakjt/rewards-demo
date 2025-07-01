import path from "node:path";
import { watchFileOrDirectory } from "./watch-file-or-directory";
import { ChangeSetReaderWriter } from "../io/changeset-reader-writer";
import { RewardReader } from "../io/reward-reader";
import { RewardDefinitionFiles } from "../constants/reward-definition-files";

export class RewardFilesWatcher {
  private readonly changeSetReaderWriter: ChangeSetReaderWriter;
  private readonly rewardReader: RewardReader;

  constructor(
    pathToChangeSet: string,
    private readonly pathToRewardsDirectory: string
  ) {
    this.changeSetReaderWriter = new ChangeSetReaderWriter(pathToChangeSet);
    this.rewardReader = new RewardReader(this.pathToRewardsDirectory);
  }

  public watchRewardsDirectory() {
    watchFileOrDirectory(
      this.pathToRewardsDirectory,
      (_, sourcePath, destinationPath) => {
        if (sourcePath.startsWith(this.pathToRewardsDirectory)) {
          this.processReward(sourcePath);
        }

        if (destinationPath.startsWith(this.pathToRewardsDirectory)) {
          this.processReward(destinationPath);
        }
      }
    );
  }

  private processReward(filepath: string) {
    const partnerId = this.extractPartnerIdFromFilePath(filepath);
    const rewardId = this.extractRewardIdFromFilePath(partnerId, filepath);

    if (this.changeSetReaderWriter.hasPartner(partnerId)) {
      const rewardHasRequiredData = this.rewardReader.rewardHasRequiredData(
        partnerId,
        rewardId
      );

      if (rewardHasRequiredData) {
        const modifiedFile = this.extractModifiedFileFromFilePath(filepath);
        const definitionFileWasModified = this.wasDefinitionFileModified(
          rewardId,
          modifiedFile
        );
        if (definitionFileWasModified) {
          this.changeSetReaderWriter.recordOrUpdateReward(
            partnerId,
            rewardId,
            new Date()
          );
        }
      } else {
        this.removeRewardFromChangeSet(partnerId, rewardId);
      }
    }
  }

  private extractPartnerIdFromFilePath(filepath: string): string {
    const pathToRewardsDirectoryWithTrailingSeparator =
      this.pathToRewardsDirectory + path.sep;

    let indexOfNextSeparator = filepath.indexOf(
      path.sep,
      pathToRewardsDirectoryWithTrailingSeparator.length
    );

    if (indexOfNextSeparator === -1) {
      indexOfNextSeparator = filepath.length;
    }

    const partnerId = filepath.slice(
      pathToRewardsDirectoryWithTrailingSeparator.length,
      indexOfNextSeparator
    );

    return partnerId;
  }

  private extractRewardIdFromFilePath(
    partnerId: string,
    filepath: string
  ): string {
    const pathToPartnerRewardsDirectoryWithTrailingSeparator =
      path.join(this.pathToRewardsDirectory, partnerId) + path.sep;

    let indexOfNextSeparator = filepath.indexOf(
      path.sep,
      pathToPartnerRewardsDirectoryWithTrailingSeparator.length
    );

    if (indexOfNextSeparator === -1) {
      indexOfNextSeparator = filepath.length;
    }

    const rewardId = filepath.slice(
      pathToPartnerRewardsDirectoryWithTrailingSeparator.length,
      indexOfNextSeparator
    );

    return rewardId;
  }

  private extractModifiedFileFromFilePath(filepath: string) {
    return path.basename(filepath);
  }

  private wasDefinitionFileModified(rewardId: string, modifiedFile: string) {
    const definitionFiles = Object.values(RewardDefinitionFiles) as string[];
    return modifiedFile === rewardId || definitionFiles.includes(modifiedFile);
  }

  private removeRewardFromChangeSet(partnerId: string, rewardId: string) {
    this.changeSetReaderWriter.removeReward(partnerId, rewardId);
  }
}
